"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchDropdown from "./SearchDropdown";
import type { Product } from "@/sanity/lib/queries";

interface SearchInputProps {
  currentLang: string;
  placeholder?: string;
  className?: string;
  variant?: "default" | "header" | "hero" | "category";
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  // New props for dropdown functionality
  showDropdown?: boolean;
  products?: Product[];
  isLoadingResults?: boolean;
  totalResults?: number;
  onProductSelect?: (product: Product) => void;
}

export default function SearchInput({
  currentLang = "en",
  placeholder,
  className = "",
  variant = "default",
  onSearch,
  autoFocus = false,
  // New dropdown props
  showDropdown = false,
  products = [],
  isLoadingResults = false,
  totalResults = 0,
  onProductSelect,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const defaultPlaceholder =
    currentLang === "en" ? "Search products..." : "Zoek producten...";

  const examples =
    currentLang === "en"
      ? ["Traditional textiles", "Handicrafts", "Jewelry", "Art pieces"]
      : ["Traditionele textiel", "Handwerk", "Sieraden", "Kunstwerken"];

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
        if (onSearch) {
          onSearch(searchQuery);
        } else {
          router.push(
            `/${currentLang}/search?q=${encodeURIComponent(searchQuery)}`
          );
        }
      }, 500); // 500ms delay
    },
    [onSearch, router, currentLang]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    // Clear existing timeout and search immediately on submit
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(
        `/${currentLang}/search?q=${encodeURIComponent(query.trim())}`
      );
    }
    setIsSearching(false);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // If onSearch is provided, call it immediately for empty queries, debounced for non-empty
    if (onSearch) {
      if (newQuery.trim() === '') {
        // Clear search immediately
        onSearch('');
      } else {
        // Debounce search for non-empty queries
        setIsSearching(true);
        debouncedSearch(newQuery.trim());
      }
    } else {
      // Only debounce if there's a query and variant is not 'header' (to avoid too many searches)
      if (newQuery.trim() && variant !== "header") {
        setIsSearching(true);
        debouncedSearch(newQuery.trim());
      }
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const clearQuery = () => {
    setQuery("");
    // Clear search immediately when onSearch is provided
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  const closeDropdown = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    // Clear any pending blur timeout when focusing
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay blur to allow click events to fire first
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  // Different styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "header":
        return {
          container: "relative max-w-md",
          input:
            "w-full pl-10 pr-10 py-2 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
          button:
            "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-primary transition-colors",
        };
      case "hero":
        return {
          container: "relative max-w-2xl mx-auto",
          input:
            "w-full pl-14 pr-14 py-4 bg-background/95 backdrop-blur-sm border-2 border-border rounded-2xl text-lg placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-lg",
          button:
            "absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105",
        };
      case "category":
        return {
          container: "relative max-w-md",
          input:
            "w-full pl-10 pr-10 py-3 bg-background border-2 border-border rounded-xl text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
          button:
            "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-primary transition-colors",
        };
      default:
        return {
          container: "relative max-w-lg",
          input:
            "w-full pl-12 pr-12 py-3 bg-background border-2 border-border rounded-xl text-base placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
          button:
            "absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon
              className={`${variant === "hero" ? "w-6 h-6" : variant === "header" ? "w-4 h-4" : "w-5 h-5"} text-muted-foreground`}
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder || defaultPlaceholder}
            className={styles.input}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className={`${styles.button} ${!query.trim() || isSearching ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSearching ? (
              <div
                className={`${variant === "hero" ? "w-5 h-5" : "w-4 h-4"} animate-spin border-2 border-current border-t-transparent rounded-full`}
              />
            ) : (
              <></>
            )}
          </button>
        </div>
      </form>

      {/* Search Dropdown - Only for header variant with dropdown enabled */}
      {showDropdown && variant === "header" && query && isFocused && (isLoadingResults || products.length > 0) && (
        <SearchDropdown
          products={products}
          searchQuery={query}
          currentLang={currentLang}
          isLoading={isLoadingResults}
          totalResults={totalResults}
          onClose={closeDropdown}
          onProductSelect={onProductSelect}
        />
      )}

      {/* Search Examples - Only for non-header variants without dropdown */}
      {isFocused && !query && variant !== "header" && !showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-background border border-border rounded-xl shadow-lg z-10">
          <p className="text-sm text-muted-foreground mb-2">
            {currentLang === "en"
              ? "Popular searches:"
              : "Populaire zoekopdrachten:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setQuery(example);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-accent transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
