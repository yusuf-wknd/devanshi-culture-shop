import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

// Types for Sanity webhook payload (simplified to match actual structure)
interface SanityWebhookBody {
  _id: string;
  _type: string;
  _rev: string;
  _createdAt?: string;
  _updatedAt?: string;
  slug?: {
    current: string;
  };
  category?: {
    _ref: string;
    slug?: {
      current: string;
    };
  };
  // Allow for additional document fields
  [key: string]: any;
}

// The parseBody function from next-sanity handles signature verification automatically

// Get paths to revalidate based on document type and data
function getPathsToRevalidate(document: SanityWebhookBody): string[] {
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

    // Parse the webhook body and verify signature using next-sanity
    const { isValidSignature, body: webhookData } = await parseBody<SanityWebhookBody>(
      request,
      secret,
      true // Wait for Content Lake eventual consistency
    );

    // Check signature validation
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Check if body was parsed successfully
    if (!webhookData) {
      console.error('Failed to parse webhook payload');
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Check if required fields exist
    if (!webhookData._id || !webhookData._type) {
      console.error('Webhook payload missing required fields:', { 
        hasId: !!webhookData._id, 
        hasType: !!webhookData._type 
      });
      return NextResponse.json(
        { error: 'Webhook payload missing required fields (_id, _type)' },
        { status: 400 }
      );
    }

    // Log the actual webhook payload for debugging
    console.log('Webhook received:', {
      id: webhookData._id,
      type: webhookData._type,
      rev: webhookData._rev,
      hasSlug: !!webhookData.slug?.current,
      hasCategory: !!webhookData.category
    });
    
    // For debugging - log the full payload (remove in production)
    console.log('Full webhook payload:', JSON.stringify(webhookData, null, 2));

    const pathsToRevalidate = new Set<string>();

    // Process the webhook document directly (not an array of mutations)
    const paths = getPathsToRevalidate(webhookData);
    paths.forEach(path => pathsToRevalidate.add(path));

    // Revalidate all collected paths
    const revalidatedPaths: string[] = [];
    const errors: string[] = [];

    if (pathsToRevalidate.size === 0) {
      console.log(`No paths to revalidate for document type: ${webhookData._type}`);
    }

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
      document: {
        id: webhookData._id,
        type: webhookData._type
      },
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