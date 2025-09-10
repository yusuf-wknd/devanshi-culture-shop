"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import SearchInput from "@/components/SearchInput";
import SortDropdown from "@/components/SortDropdown";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/sanity/lib/queries";

interface CategoryProductsGridProps {
  products: Product[];
  currentLang: string;
  categoryName: string;
}

export default function CategoryProductsGrid({
  products,
  currentLang,
  categoryName,
}: CategoryProductsGridProps) {
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sortOptions = [
    {
      value: "featured",
      label: currentLang === "en" ? "Featured" : "Uitgelicht",
    },
    {
      value: "name-asc",
      label: currentLang === "en" ? "Name (A-Z)" : "Naam (A-Z)",
    },
    {
      value: "price-asc",
      label:
        currentLang === "en" ? "Price (Low to High)" : "Prijs (Laag naar Hoog)",
    },
    {
      value: "price-desc",
      label:
        currentLang === "en" ? "Price (High to Low)" : "Prijs (Hoog naar Laag)",
    },
  ];

  const sortedAndFilteredProducts = useMemo(() => {
    let filteredProducts = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredProducts = products.filter((product) => {
        const name =
          product.productName[
            currentLang as keyof typeof product.productName
          ]?.toLowerCase() || "";
        const description =
          product.description?.[
            currentLang as keyof typeof product.description
          ]?.toLowerCase() || "";
        return name.includes(query) || description.includes(query);
      });
    }

    // Sort products
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (
            a.productName[currentLang as keyof typeof a.productName] || ""
          ).localeCompare(
            b.productName[currentLang as keyof typeof b.productName] || ""
          );
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "featured":
        default:
          return a.itemNumber.localeCompare(b.itemNumber);
      }
    });

    return sorted;
  }, [products, sortBy, searchQuery, currentLang]);

  return (
    <>
      {/* Compact Filter Toolbar */}
      <div className="bg-background border-b border-border/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Product Count */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {sortedAndFilteredProducts.length}
              </span>
              <span>
                {currentLang === "en"
                  ? sortedAndFilteredProducts.length === 1
                    ? "product"
                    : "products"
                  : sortedAndFilteredProducts.length === 1
                    ? "product"
                    : "producten"}
              </span>
              {searchQuery && (
                <>
                  <span>•</span>
                  <span>
                    {currentLang === "en" ? "filtered by" : "gefilterd op"} "
                    {searchQuery}"
                  </span>
                </>
              )}
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 lg:ml-auto">
              {/* Search Input - Takes more space */}
              <div className="flex-1 min-w-0 sm:min-w-[300px]">
                <SearchInput
                  currentLang={currentLang}
                  placeholder={
                    currentLang === "en"
                      ? `Search in ${categoryName}...`
                      : `Zoeken in ${categoryName}...`
                  }
                  onSearch={setSearchQuery}
                  variant="category"
                />
              </div>

              {/* Sort Dropdown - Fixed width */}
              <div className="sm:flex-shrink-0">
                <SortDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-full sm:w-[200px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedAndFilteredProducts.length > 0 ? (
            <>
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {currentLang === "en" ? "Our Collection" : "Onze Collectie"}
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? currentLang === "en"
                      ? `Found ${sortedAndFilteredProducts.length} products matching "${searchQuery}"`
                      : `${sortedAndFilteredProducts.length} producten gevonden voor "${searchQuery}"`
                    : currentLang === "en"
                      ? `Discover our carefully selected ${categoryName.toLowerCase()} collection`
                      : `Ontdek onze zorgvuldig geselecteerde ${categoryName.toLowerCase()} collectie`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedAndFilteredProducts.map((product: Product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    currentLang={currentLang}
                    showCategory={false}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                {searchQuery ? (
                  <MagnifyingGlassIcon className="w-8 h-8 text-primary" />
                ) : (
                  <span className="text-3xl font-serif font-bold text-primary">
                    {categoryName.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                {searchQuery
                  ? currentLang === "en"
                    ? "No Products Found"
                    : "Geen Producten Gevonden"
                  : currentLang === "en"
                    ? "No Products Yet"
                    : "Nog Geen Producten"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {searchQuery
                  ? currentLang === "en"
                    ? `No products found matching "${searchQuery}". Try a different search term.`
                    : `Geen producten gevonden voor "${searchQuery}". Probeer een andere zoekterm.`
                  : currentLang === "en"
                    ? `We're currently updating our ${categoryName.toLowerCase()} collection. Check back soon!`
                    : `We werken momenteel aan onze ${categoryName.toLowerCase()} collectie. Kom binnenkort terug!`}
              </p>
              <Link
                href={`/${currentLang}/categories`}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300"
              >
                <span>
                  {currentLang === "en"
                    ? "Browse Other Categories"
                    : "Bekijk Andere Categorieën"}
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
