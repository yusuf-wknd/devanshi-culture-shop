"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SearchInput from "./SearchInput";
import type { Product } from "@/sanity/lib/queries";

interface HeaderProps {
  currentLang: string;
}

export default function Header({ currentLang = "en" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangDropdown = () => setIsLangDropdownOpen(!isLangDropdownOpen);

  // Extract path without language code (e.g., /en/about -> /about)
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  // Search functionality
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsLoadingSearch(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&limit=4`
        );
        const data = await response.json();

        setSearchResults(data.products || []);
        setTotalResults(data.total || 0);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setTotalResults(0);
      } finally {
        setIsLoadingSearch(false);
      }
    }, 300);
  }, []);

  const handleProductSelect = useCallback(
    (product: Product) => {
      const productUrl = `/${currentLang}/${product.category?.slug?.current}/${product.slug.current}`;
      router.push(productUrl);
    },
    [currentLang, router]
  );

  const handleSearchSubmit = useCallback(
    (query: string) => {
      if (query.trim()) {
        router.push(
          `/${currentLang}/search?q=${encodeURIComponent(query.trim())}`
        );
      }
    },
    [currentLang, router]
  );

  const navigation = [
    {
      name: currentLang === "en" ? "Home" : "Home",
      href: `/${currentLang}`,
    },
    {
      name: currentLang === "en" ? "Categories" : "Categorieën",
      href: `/${currentLang}/categories`,
    },
    {
      name: currentLang === "en" ? "About" : "Over Ons",
      href: `/${currentLang}/about`,
    },
    {
      name: currentLang === "en" ? "Contact" : "Contact",
      href: `/${currentLang}/contact`,
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={`/${currentLang}`}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-serif font-bold text-lg">
                D
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-bold text-primary">
                Devanshi
              </h1>
              <p className="font-sans text-xs text-muted-foreground -mt-1">
                Culture Shop
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search Bar */}
            <div className="hidden lg:block">
              <SearchInput
                currentLang={currentLang}
                variant="header"
                className="w-64"
                showDropdown={true}
                products={searchResults}
                isLoadingResults={isLoadingSearch}
                totalResults={totalResults}
                onSearch={handleSearch}
                onProductSelect={handleProductSelect}
              />
            </div>
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={toggleLangDropdown}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
              >
                <span>
                  {languages.find((lang) => lang.code === currentLang)?.flag}
                </span>
                <span className="hidden sm:inline">
                  {languages.find((lang) => lang.code === currentLang)?.name}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Language Dropdown */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border py-2 z-10">
                  {languages.map((language) => (
                    <Link
                      key={language.code}
                      href={`/${language.code}${pathWithoutLang === "/" ? "" : pathWithoutLang}`}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setIsLangDropdownOpen(false)}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                      {currentLang === language.code && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-auto"></div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-foreground" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-4">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <SearchInput
                currentLang={currentLang}
                variant="header"
                className="w-full"
                showDropdown={true}
                products={searchResults}
                isLoadingResults={isLoadingSearch}
                totalResults={totalResults}
                onSearch={handleSearch}
                onProductSelect={handleProductSelect}
              />
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
