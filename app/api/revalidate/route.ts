import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createHash, createHmac } from 'crypto';

// Types for Sanity webhook payload
interface SanityDocument {
  _id: string;
  _type: string;
  slug?: {
    current: string;
  };
  category?: {
    _ref: string;
    slug?: {
      current: string;
    };
  };
}

interface SanityWebhookPayload {
  _id: string;
  _type: string;
  _rev: string;
  slug?: {
    current: string;
  };
  category?: {
    _ref: string;
  };
}

interface WebhookBody {
  _type: 'webhook';
  projectId: string;
  dataset: string;
  ids: {
    created: string[];
    updated: string[];
    deleted: string[];
  };
  mutations: Array<{
    _id: string;
    _type: string;
    create?: SanityDocument;
    createOrReplace?: SanityDocument;
    createIfNotExists?: SanityDocument;
    patch?: {
      id: string;
    };
    delete?: {
      id: string;
    };
  }>;
}

// Verify the webhook signature
function verifySignature(body: string, signature: string, secret: string): boolean {
  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('hex');
    
  return `sha256=${expectedSignature}` === signature;
}

// Get paths to revalidate based on document type and data
function getPathsToRevalidate(document: SanityDocument): string[] {
  const paths: string[] = [];
  const languages = ['en', 'nl'];

  switch (document._type) {
    case 'product':
      // Revalidate product pages for both languages
      if (document.slug?.current) {
        languages.forEach(lang => {
          if (document.category) {
            // Product with category
            paths.push(`/${lang}/${document.category.slug?.current || 'products'}/${document.slug!.current}`);
          } else {
            // Product without category
            paths.push(`/${lang}/products/${document.slug!.current}`);
          }
        });
      }
      
      // Also revalidate category pages if product belongs to a category
      if (document.category?.slug?.current) {
        languages.forEach(lang => {
          paths.push(`/${lang}/${document.category!.slug!.current}`);
        });
      }
      
      // Revalidate homepage (for featured products, new arrivals, etc.)
      languages.forEach(lang => {
        paths.push(`/${lang}`);
      });
      break;

    case 'category':
      // Revalidate category pages
      if (document.slug?.current) {
        languages.forEach(lang => {
          paths.push(`/${lang}/${document.slug!.current}`);
        });
      }
      
      // Revalidate homepage (for category showcase)
      languages.forEach(lang => {
        paths.push(`/${lang}`);
      });
      break;

    case 'homePage':
      // Revalidate homepage for both languages
      languages.forEach(lang => {
        paths.push(`/${lang}`);
      });
      break;

    case 'aboutPage':
      // Revalidate about pages
      languages.forEach(lang => {
        paths.push(`/${lang}/about`);
      });
      break;

    case 'storeSettings':
      // Revalidate all pages that use store settings (contact, footer, etc.)
      languages.forEach(lang => {
        paths.push(`/${lang}`);
        paths.push(`/${lang}/contact`);
        paths.push(`/${lang}/about`);
      });
      break;

    default:
      console.log(`Unknown document type: ${document._type}`);
  }

  return paths;
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    
    if (!secret) {
      console.error('SANITY_REVALIDATE_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get the signature from headers
    const signature = request.headers.get('sanity-webhook-signature');
    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.text();
    
    // Verify the webhook signature
    if (!verifySignature(body, signature, secret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    let webhookData: WebhookBody;
    try {
      webhookData = JSON.parse(body);
    } catch (error) {
      console.error('Invalid JSON payload:', error);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    console.log('Webhook received:', {
      type: webhookData._type,
      projectId: webhookData.projectId,
      dataset: webhookData.dataset,
      mutations: webhookData.mutations.length
    });

    const pathsToRevalidate = new Set<string>();

    // Process each mutation
    for (const mutation of webhookData.mutations) {
      let document: SanityDocument | null = null;

      // Extract document data from mutation
      if (mutation.create) {
        document = mutation.create;
      } else if (mutation.createOrReplace) {
        document = mutation.createOrReplace;
      } else if (mutation.createIfNotExists) {
        document = mutation.createIfNotExists;
      } else if (mutation.patch) {
        // For patches, we need to make assumptions about the document type
        // This is a limitation - we might need to fetch the document to get complete info
        document = {
          _id: mutation.patch.id,
          _type: mutation._type
        };
      } else if (mutation.delete) {
        // For deletions, we have limited info but can still revalidate common paths
        document = {
          _id: mutation.delete.id,
          _type: mutation._type
        };
      }

      if (document) {
        const paths = getPathsToRevalidate(document);
        paths.forEach(path => pathsToRevalidate.add(path));
      }
    }

    // Revalidate all collected paths
    const revalidatedPaths: string[] = [];
    const errors: string[] = [];

    for (const path of Array.from(pathsToRevalidate)) {
      try {
        await revalidatePath(path);
        revalidatedPaths.push(path);
        console.log(`✓ Revalidated: ${path}`);
      } catch (error) {
        const errorMsg = `Failed to revalidate ${path}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // Return success response
    const response = {
      revalidated: revalidatedPaths,
      timestamp: new Date().toISOString(),
      mutations: webhookData.mutations.length,
      ...(errors.length > 0 && { errors })
    };

    console.log('Revalidation completed:', response);

    return NextResponse.json(response, { 
      status: errors.length > 0 ? 207 : 200 // 207 = Multi-Status (partial success)
    });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Sanity webhook revalidation endpoint is active',
    timestamp: new Date().toISOString()
  });
}