"use client";

import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/sanity/lib/queries";

interface ProductCardProps {
  product: Product;
  currentLang: string;
  showCategory?: boolean;
  className?: string;
  onQuickView?: (product: Product) => void;
  enableQuickView?: boolean;
}

export default function ProductCard({
  product,
  currentLang = "en",
  showCategory = true,
  className = "",
  onQuickView,
  enableQuickView = false,
}: ProductCardProps) {
  const productName =
    product.productName[currentLang as keyof typeof product.productName] ||
    product.productName.en;
  const categoryName =
    product.category?.categoryName[
      currentLang as keyof typeof product.category.categoryName
    ] || product.category?.categoryName.en;
  const description =
    product.description?.[currentLang as keyof typeof product.description] ||
    product.description?.en;

  const mainImage = product.productImages?.[0];
  const hoverImage = product.productImages?.[1];

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className={`group relative bg-background rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 hover:border-primary/20 overflow-hidden ${className}`}
    >
      {/* Product Link */}
      <Link
        href={
          product.category?.slug?.current 
            ? `/${currentLang}/${product.category.slug.current}/${product.slug.current}`
            : `/${currentLang}/products/${product.slug.current}`
        }
        className="block"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-secondary/30">
          {mainImage && (
            <>
              {/* Main Image */}
              <Image
                src={urlFor(mainImage.asset).width(400).height(400).url()}
                alt={mainImage.alt || productName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              {/* Hover Image */}
              {hoverImage && (
                <Image
                  src={urlFor(hoverImage.asset).width(400).height(400).url()}
                  alt={hoverImage.alt || productName}
                  fill
                  className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              )}
            </>
          )}

          {/* Quick View Button */}
          {enableQuickView && onQuickView && (
            <button
              onClick={handleQuickView}
              className="absolute top-3 right-3 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-background hover:shadow-md transition-all duration-300 hover:scale-110 z-10"
              aria-label={
                currentLang === "en" ? "Quick view" : "Snelle weergave"
              }
            >
              <EyeIcon className="w-5 h-5 text-foreground" />
            </button>
          )}

          {/* Overlay for better contrast on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          {showCategory && categoryName && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {categoryName}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {productName}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Pricing */}
          {product.price && (
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold text-foreground">
                €{product.price.toFixed(2)}
              </span>
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm">
              {currentLang === "en" ? "View Details" : "Bekijk Details"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
