import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

const searchQuery = groq`
  *[_type == "product" && (
    productName.en match $searchTerm + "*" ||
    productName.nl match $searchTerm + "*" ||
    description.en match $searchTerm + "*" ||
    description.nl match $searchTerm + "*"
  )] | order(_score desc, itemNumber asc) [0...$limit] {
    _id,
    productName {
      "en": en,
      "nl": nl
    },
    slug,
    productImages[] {
      asset->,
      alt
    },
    category-> {
      categoryName {
        "en": en,
        "nl": nl
      },
      slug
    },
    itemNumber,
    price,
    isAvailable
  }
`;

const countQuery = groq`
  count(*[_type == "product" && (
    productName.en match $searchTerm + "*" ||
    productName.nl match $searchTerm + "*" ||
    description.en match $searchTerm + "*" ||
    description.nl match $searchTerm + "*"
  )])
`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    
    if (!searchTerm || searchTerm.trim().length < 2) {
      return NextResponse.json({
        products: [],
        total: 0,
        message: 'Search term too short'
      });
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 4; // Default to 4 for dropdown
    const cleanSearchTerm = searchTerm.trim();

    // Execute both queries in parallel
    const [products, total] = await Promise.all([
      client.fetch(searchQuery, { searchTerm: cleanSearchTerm, limit }),
      client.fetch(countQuery, { searchTerm: cleanSearchTerm })
    ]);

    return NextResponse.json({
      products,
      total,
      query: cleanSearchTerm,
      limit
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search products',
        products: [],
        total: 0
      },
      { status: 500 }
    );
  }
}