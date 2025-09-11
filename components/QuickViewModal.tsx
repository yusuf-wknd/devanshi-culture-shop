"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { urlFor } from "@/sanity/lib/image";
import WhatsAppButton from "./WhatsAppButton";
import type { Product } from "@/sanity/lib/queries";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  currentLang,
}: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  if (!isOpen || !product) return null;

  const productName = product.productName[currentLang as "en" | "nl"] || product.productName.en;
  const productDescription = product.description?.[currentLang as "en" | "nl"] || product.description?.en;
  const categoryName =
    product.category?.categoryName?.[currentLang as "en" | "nl"] || product.category?.categoryName?.en;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {currentLang === "en" ? "Quick View" : "Snelle Weergave"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label={currentLang === "en" ? "Close modal" : "Modal sluiten"}
          >
            <XMarkIcon className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/30">
              {product.productImages.length > 0 ? (
                <Image
                  src={urlFor(product.productImages[currentImageIndex].asset)
                    .width(500)
                    .height(500)
                    .url()}
                  alt={
                    product.productImages[currentImageIndex].alt || productName
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-serif font-bold text-primary">
                      {productName.charAt(0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background hover:shadow-md transition-all duration-300 hover:scale-110"
                aria-label={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isInWishlist ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-foreground hover:text-red-500 transition-colors" />
                )}
              </button>
            </div>

            {/* Thumbnail Images */}
            {product.productImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto">
                {product.productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={urlFor(image.asset).width(64).height(64).url()}
                      alt={image.alt || `${productName} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {categoryName && (
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {categoryName}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {productName}
            </h3>

            {/* Pricing */}
            {product.price && (
              <div className="flex items-center space-x-3">
                <span className="font-sans text-2xl font-bold text-foreground">
                  €{product.price.toFixed(2)}
                </span>
              </div>
            )}

            {/* Description */}
            {productDescription && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {productDescription}
                </p>
              </div>
            )}

            {/* Product Features */}
            <div className="border-t border-border pt-6">
              <h4 className="font-serif text-lg font-semibold text-foreground mb-3">
                {currentLang === "en"
                  ? "Product Features"
                  : "Product Kenmerken"}
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    {currentLang === "en"
                      ? "Authentic cultural product"
                      : "Authentiek cultureel product"}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    {currentLang === "en"
                      ? "Handcrafted with care"
                      : "Met zorg handgemaakt"}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    {currentLang === "en"
                      ? "Fast and secure delivery"
                      : "Snelle en veilige levering"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 border-t border-border pt-6">
              <a
                href={`/${currentLang}/products/${product.slug.current}`}
                className="w-full inline-flex items-center justify-center py-3 px-6 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-accent transition-colors"
              >
                {currentLang === "en"
                  ? "View Full Details"
                  : "Bekijk Volledige Details"}
              </a>

              <div className="relative">
                <WhatsAppButton
                  currentLang={currentLang}
                  productName={productName}
                  className="static"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
