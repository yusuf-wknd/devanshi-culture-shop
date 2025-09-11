"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
    { code: "en", name: "English" },
    { code: "nl", name: "Nederlands" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link
            href={`/${currentLang}`}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <Image
              src="/logo.png"
              alt="Devanshi Culture Shop"
              width={400}
              height={120}
              className="h-12 sm:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-sans text-sm font-medium text-foreground hover:text-primary transition-all duration-200 relative group hover:scale-105"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
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
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-all duration-200 hover:scale-105"
              >
                <span>{currentLang.toUpperCase()}</span>
                <span className="hidden sm:inline">
                  {languages.find((lang) => lang.code === currentLang)?.name}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Language Dropdown */}
              {isLangDropdownOpen && (
                <div 
                  className={`
                    absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border py-2 z-10
                    transform transition-all duration-200 ease-out
                    ${isLangDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'}
                  `}
                >
                  {languages.map((language, index) => (
                    <Link
                      key={language.code}
                      href={`/${language.code}${pathWithoutLang === "/" ? "" : pathWithoutLang}`}
                      className={`
                        flex items-center space-x-3 px-4 py-2 text-sm text-foreground 
                        hover:bg-secondary hover:translate-x-1 transition-all duration-150
                        ${isLangDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
                      `}
                      style={{
                        transitionDelay: isLangDropdownOpen ? `${index * 30}ms` : '0ms'
                      }}
                      onClick={() => setIsLangDropdownOpen(false)}
                    >
                      <span>{language.code.toUpperCase()}</span>
                      <span>{language.name}</span>
                      {currentLang === language.code && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-auto animate-pulse"></div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-all duration-200 hover:scale-105"
            >
              <div className="relative w-6 h-6">
                <Bars3Icon 
                  className={`
                    absolute w-6 h-6 text-foreground
                    transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}
                  `}
                />
                <XMarkIcon 
                  className={`
                    absolute w-6 h-6 text-foreground
                    transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}
                  `}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`
            fixed inset-0 z-50 md:hidden
            ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          `}
        >
          {/* Backdrop */}
          <div
            className={`
              absolute inset-0 bg-black/50 backdrop-blur-sm
              transition-opacity duration-300 ease-in-out
              ${isMenuOpen ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className={`
              absolute right-0 top-0 h-full w-full sm:w-80 bg-background
              transform transition-transform duration-300 ease-in-out
              shadow-2xl
              ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                {currentLang === "en" ? "Menu" : "Menu"}
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
              {/* Mobile Search */}
              <div className="px-6 py-4 border-b border-border">
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

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-6">
                <div className="space-y-2">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        block px-4 py-3 text-foreground hover:bg-secondary rounded-lg 
                        transition-all duration-200 font-medium text-lg
                        transform hover:translate-x-1 hover:scale-[1.02]
                        ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                      `}
                      style={{ 
                        transitionDelay: isMenuOpen ? `${(index + 1) * 50}ms` : '0ms'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
