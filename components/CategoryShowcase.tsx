import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface Category {
  _id: string;
  categoryName: {
    en: string;
    nl: string;
  };
  slug: {
    current: string;
  };
  description?: {
    en: string;
    nl: string;
  };
  categoryImage?: {
    asset: any;
    alt: string;
  };
  productCount?: number;
}

interface CategoryShowcaseProps {
  categories: Category[];
  currentLang: string;
  title?: {
    en: string;
    nl: string;
  };
  showAll?: boolean;
  maxItems?: number;
  className?: string;
}

export default function CategoryShowcase({
  categories = [],
  currentLang = "en",
  title,
  showAll = true,
  maxItems = 6,
  className = "",
}: CategoryShowcaseProps) {
  const displayCategories = maxItems
    ? categories.slice(0, maxItems)
    : categories;
  const currentTitle = title?.[currentLang as keyof typeof title];

  // Fallback categories if none provided
  const fallbackCategories: Category[] = [
    {
      _id: "1",
      categoryName: { en: "Traditional Jewelry", nl: "Traditionele Sieraden" },
      slug: { current: "traditional-jewelry" },
      description: {
        en: "Handcrafted pieces with cultural significance",
        nl: "Handgemaakte stukken met culturele betekenis",
      },
      productCount: 24,
    },
    {
      _id: "2",
      categoryName: { en: "Textiles & Fabrics", nl: "Textiel & Stoffen" },
      slug: { current: "textiles-fabrics" },
      description: {
        en: "Beautiful fabrics and traditional textiles",
        nl: "Prachtige stoffen en traditionele textiel",
      },
      productCount: 18,
    },
    {
      _id: "3",
      categoryName: { en: "Art & Crafts", nl: "Kunst & Ambacht" },
      slug: { current: "art-crafts" },
      description: {
        en: "Unique artistic creations and handicrafts",
        nl: "Unieke artistieke creaties en handwerk",
      },
      productCount: 32,
    },
    {
      _id: "4",
      categoryName: { en: "Home Decor", nl: "Woondecoratie" },
      slug: { current: "home-decor" },
      description: {
        en: "Decorative items for your living space",
        nl: "Decoratieve items voor je woonruimte",
      },
      productCount: 15,
    },
    {
      _id: "5",
      categoryName: { en: "Religious Items", nl: "Religieuze Voorwerpen" },
      slug: { current: "religious-items" },
      description: {
        en: "Sacred and spiritual artifacts",
        nl: "Heilige en spirituele voorwerpen",
      },
      productCount: 12,
    },
    {
      _id: "6",
      categoryName: { en: "Musical Instruments", nl: "Muziekinstrumenten" },
      slug: { current: "musical-instruments" },
      description: {
        en: "Traditional and cultural musical instruments",
        nl: "Traditionele en culturele muziekinstrumenten",
      },
      productCount: 8,
    },
  ];

  const categoriesToShow =
    displayCategories.length > 0
      ? displayCategories
      : fallbackCategories.slice(0, maxItems);

  return (
    <section
      className={`py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary/30 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {title && (
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              {currentTitle}
            </h2>
            <p className="font-sans text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              {currentLang === "en"
                ? "Discover our carefully curated collection of authentic cultural products from around the world"
                : "Ontdek onze zorgvuldig samengestelde collectie authentieke culturele producten van over de hele wereld"}
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mt-6 sm:mt-8">
              <div className="w-12 sm:w-16 h-px bg-primary"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
              <div className="w-12 sm:w-16 h-px bg-primary"></div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoriesToShow.map((category, index) => {
            const categoryName =
              category.categoryName[
                currentLang as keyof typeof category.categoryName
              ];
            const description =
              category.description?.[
                currentLang as keyof typeof category.description
              ];

            return (
              <Link
                key={category._id}
                href={`/${currentLang}/${category.slug.current}`}
                className="group block"
              >
                <div className="bg-background rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border/50 hover:border-primary/20 hover:-translate-y-2 transform">
                  {/* Category Image */}
                  <div className="relative aspect-[5/4] overflow-hidden bg-secondary/30">
                    {category.categoryImage ? (
                      <Image
                        src={
                          category.categoryImage.asset.url ||
                          "/placeholder-category.jpg"
                        }
                        alt={category.categoryImage.alt || categoryName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-serif font-bold text-primary">
                            {categoryName.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>

                    {/* Product Count Badge */}
                    {category.productCount && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 shadow-lg">
                        <span className="text-xs font-medium text-foreground">
                          {category.productCount}{" "}
                          {currentLang === "en" ? "items" : "artikelen"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {categoryName}
                      </h3>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 transform">
                        <ArrowRightIcon className="w-5 h-5" />
                      </div>
                    </div>

                    {description && (
                      <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    )}

                    {/* Explore Button */}
                    <div className="pt-2">
                      <div className="inline-flex items-center text-primary font-medium text-sm group-hover:text-primary/80 transition-colors">
                        <span className="mr-2">
                          {currentLang === "en"
                            ? "Explore Collection"
                            : "Bekijk Collectie"}
                        </span>
                        <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Categories Button */}
        {showAll && categories.length > maxItems && (
          <div className="text-center mt-12 sm:mt-16">
            <Link
              href={`/${currentLang}/categories`}
              className="inline-flex items-center space-x-3 bg-primary text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              <span>
                {currentLang === "en"
                  ? "View All Categories"
                  : "Bekijk Alle Categorieën"}
              </span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-flex items-center sm:space-x-4 text-muted-foreground">
            <div className="hidden sm:block w-6 sm:w-8 h-px bg-accent"></div>
            <span className="font-serif text-xs sm:text-sm font-medium tracking-wider uppercase">
              {currentLang === "en"
                ? "Authentic • Cultural • Handcrafted"
                : "Authentiek • Cultureel • Handgemaakt"}
            </span>
            <div className="hidden sm:block w-6 sm:w-8 h-px bg-accent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
