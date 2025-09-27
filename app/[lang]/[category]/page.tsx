import {
  getCategoryBySlug,
  getProductsByCategory,
  getCategoryStaticParams,
  getAllCategories,
} from "@/sanity/lib/queries";
import type { Category, Product } from "@/sanity/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CategoryProductsGrid from "@/components/CategoryProductsGrid";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const categories = await getCategoryStaticParams();
    const languages = ["en", "nl"];

    return languages.flatMap((lang) =>
      categories.map((category: { slug: string }) => ({
        lang,
        category: category.slug,
      }))
    );
  } catch (error) {
    console.error("Error generating static params for categories:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, category } = await params;

  try {
    const categoryData = await getCategoryBySlug(category);

    if (!categoryData) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    const title =
      categoryData.seo?.metaTitle?.[lang as "en" | "nl"] ||
      `${categoryData.categoryName[lang as "en" | "nl"] || categoryData.categoryName.en} - Devanshi Culture Shop`;

    const description =
      categoryData.seo?.metaDescription?.[lang as "en" | "nl"] ||
      categoryData.description?.[lang as "en" | "nl"] ||
      categoryData.description?.en ||
      (lang === "en"
        ? `Discover authentic ${categoryData.categoryName.en} at Devanshi Culture Shop`
        : `Ontdek authentieke ${categoryData.categoryName.nl || categoryData.categoryName.en} bij Devanshi Culture Shop`);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        locale: lang,
        images: categoryData.categoryImage
          ? [
              {
                url: urlFor(categoryData.categoryImage.asset)
                  .width(1200)
                  .height(630)
                  .url(),
                width: 1200,
                height: 630,
                alt:
                  categoryData.categoryImage.alt ||
                  categoryData.categoryName[lang as "en" | "nl"] || categoryData.categoryName.en,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Category - Devanshi Culture Shop",
      description: "Discover authentic cultural products",
    };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang, category } = await params;

  try {
    // Fetch category, its products, and all categories
    const [categoryData, products, categories] = await Promise.all([
      getCategoryBySlug(category),
      getProductsByCategory(category).catch(() => []),
      getAllCategories().catch(() => []),
    ]);

    if (!categoryData) {
      notFound();
    }

    const categoryName = categoryData.categoryName[lang as "en" | "nl"] || categoryData.categoryName.en;
    const categoryDescription = categoryData.description?.[lang as "en" | "nl"] || categoryData.description?.en;

    // Generate JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: categoryName,
      description: categoryDescription || `${categoryName} collection`,
      url: `https://devanshicultureshop.nl/${lang}/${category}`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: products.length,
        itemListElement: products.map((product: Product, index: number) => ({
          "@type": "Product",
          position: index + 1,
          name: product.productName[lang as "en" | "nl"] || product.productName.en,
          url: `https://devanshicultureshop.nl/${lang}/${category}/${product.slug.current}`,
          image: product.productImages[0]
            ? urlFor(product.productImages[0].asset)
                .width(400)
                .height(400)
                .url()
            : undefined,
        })),
      },
    };

    // Breadcrumb structured data
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: lang === "en" ? "Home" : "Home",
          item: `https://devanshicultureshop.nl/${lang}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryName,
          item: `https://devanshicultureshop.nl/${lang}/${category}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData),
          }}
        />
        <Header currentLang={lang} categories={categories} />

        <main>
          {/* Category Header */}
          <section className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Category Name and Product Count */}
              <div className="flex items-center justify-start space-x-3">
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  {categoryName}
                </h1>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <span className="text-sm sm:text-base text-muted-foreground hidden sm:inline">
                  {products.length}{" "}
                  {lang === "en"
                    ? products.length === 1
                      ? "Product"
                      : "Products"
                    : products.length === 1
                      ? "Product"
                      : "Producten"}
                </span>
              </div>
            </div>
          </section>

          {/* Client-side Products Grid with Search & Sort */}
          <CategoryProductsGrid
            products={products}
            currentLang={lang}
            categoryName={categoryName}
          />
        </main>

        <Footer currentLang={lang} />
        <WhatsAppButton currentLang={lang} />
      </>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}
