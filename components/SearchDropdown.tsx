'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import type { Product } from '@/sanity/lib/queries';

interface SearchDropdownProps {
  products: Product[];
  searchQuery: string;
  currentLang: string;
  isLoading?: boolean;
  totalResults?: number;
  onClose: () => void;
  onProductSelect?: (product: Product) => void;
}

export default function SearchDropdown({
  products,
  searchQuery,
  currentLang,
  isLoading = false,
  totalResults = 0,
  onClose,
  onProductSelect,
}: SearchDropdownProps) {
  const router = useRouter();

  const handleProductClick = (product: Product) => {
    // Navigate first (while component is still mounted)
    const productUrl = `/${currentLang}/${product.category?.slug?.current}/${product.slug.current}`;
    router.push(productUrl);
    // Then close the dropdown
    onClose();
  };
  
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 p-4">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            {currentLang === "en" ? "Searching..." : "Zoeken..."}
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {currentLang === "en" ? "No products found" : "Geen producten gevonden"}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentLang === "en" 
              ? `Try searching for "${searchQuery}" on our search page`
              : `Probeer "${searchQuery}" te zoeken op onze zoekpagina`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
      {/* Product Results */}
      <div className="p-2">
        <div className="text-xs text-muted-foreground mb-3 px-2">
          {totalResults > products.length ? (
            currentLang === "en" 
              ? `Showing ${products.length} of ${totalResults} results`
              : `${products.length} van ${totalResults} resultaten`
          ) : (
            currentLang === "en"
              ? `${products.length} ${products.length === 1 ? 'result' : 'results'}`
              : `${products.length} ${products.length === 1 ? 'resultaat' : 'resultaten'}`
          )}
        </div>
        
        <div className="space-y-1">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product)}
              className="block p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
              {/* Product Image */}
              <div className="relative w-12 h-12 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
                {product.productImages && product.productImages[0] ? (
                  <Image
                    src={urlFor(product.productImages[0].asset)
                      .width(60)
                      .height(60)
                      .url()}
                    alt={product.productImages[0].alt || product.productName[currentLang as keyof typeof product.productName]}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs font-serif font-bold text-primary">
                      {product.productName[currentLang as keyof typeof product.productName]?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {product.productName[currentLang as keyof typeof product.productName]}
                  </h3>
                  {product.category && (
                    <p className="text-xs text-muted-foreground truncate">
                      {product.category.categoryName[currentLang as keyof typeof product.category.categoryName]}
                    </p>
                  )}
                </div>

                {/* Price */}
                {product.price && (
                  <div className="text-sm font-semibold text-primary">
                    €{product.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Results Button */}
      {totalResults > products.length && (
        <div className="border-t border-border/50 p-2">
          <Link
            href={`/${currentLang}/search?q=${encodeURIComponent(searchQuery)}`}
            onClick={onClose}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-primary/5 hover:bg-primary/10 text-primary font-medium rounded-lg transition-colors text-sm"
          >
            <span>
              {currentLang === "en"
                ? `View all ${totalResults} results`
                : `Bekijk alle ${totalResults} resultaten`
              }
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}