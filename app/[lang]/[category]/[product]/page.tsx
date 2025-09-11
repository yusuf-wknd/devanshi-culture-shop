import {
  getProductBySlug,
  getProductStaticParams,
  getAllProducts,
  getCategoryStaticParams,
  getStoreSettings,
} from "@/sanity/lib/queries";
import type { Product, StoreSettings } from "@/sanity/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShareButton from "@/components/ShareButton";
import ProductImageGallery from "@/components/ProductImageGallery";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.696" />
  </svg>
);

interface PageProps {
  params: Promise<{
    lang: string;
    category: string;
    product: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const products = await getProductStaticParams();
    const categories = await getCategoryStaticParams();
    const languages = ["en", "nl"];

    return languages.flatMap((lang) =>
      products
        .filter((product: any) => product.category) // Only products with categories
        .map((product: any) => ({
          lang,
          category: product.category,
          product: product.slug,
        }))
    );
  } catch (error) {
    console.error("Error generating static params for products:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, product } = await params;

  try {
    const productData = await getProductBySlug(product);

    if (!productData) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const title =
      productData.seo?.metaTitle?.[lang as "en" | "nl"] ||
      `${productData.productName[lang as "en" | "nl"] || productData.productName.en} - Devanshi Culture Shop`;

    const description =
      productData.seo?.metaDescription?.[lang as "en" | "nl"] ||
      productData.description?.[lang as "en" | "nl"] ||
      productData.description?.en ||
      (lang === "en"
        ? `Discover ${productData.productName.en} at Devanshi Culture Shop - Authentic cultural products`
        : `Ontdek ${productData.productName.nl || productData.productName.en} bij Devanshi Culture Shop - Authentieke culturele producten`);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        locale: lang,
        images:
          productData.productImages.length > 0
            ? [
                {
                  url: urlFor(productData.productImages[0].asset)
                    .width(1200)
                    .height(630)
                    .url(),
                  width: 1200,
                  height: 630,
                  alt:
                    productData.productImages[0].alt ||
                    productData.productName[lang as "en" | "nl"] || productData.productName.en,
                },
              ]
            : [],
      },
    };
  } catch (error) {
    return {
      title: "Product - Devanshi Culture Shop",
      description: "Discover authentic cultural products",
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { lang, category, product } = await params;

  try {
    // Fetch product, related products, and store settings
    const [productData, allProducts, storeSettings] = await Promise.all([
      getProductBySlug(product),
      getAllProducts().catch(() => []),
      getStoreSettings().catch(() => null),
    ]);

    if (!productData) {
      notFound();
    }

    // Verify the category matches the product's category
    if (productData.category?.slug?.current !== category) {
      notFound();
    }

    const productName = productData.productName[lang as "en" | "nl"] || productData.productName.en;
    const productDescription = productData.description?.[lang as "en" | "nl"] || productData.description?.en;
    const categoryName =
      productData.category?.categoryName?.[lang as "en" | "nl"] || productData.category?.categoryName?.en;

    // Get related products (same category, excluding current product)
    const relatedProducts = allProducts
      .filter(
        (p: Product) =>
          p.category?.slug?.current === productData.category?.slug?.current &&
          p._id !== productData._id
      )
      .slice(0, 4);

    // Generate WhatsApp URL with product inquiry
    const phoneNumber = storeSettings?.phoneMain || "+31612345678"; // Fallback if no store settings
    const whatsappMessage =
      lang === "en"
        ? `Hello! I'm interested in the product: ${productName}. Could you provide more information?`
        : `Hallo! Ik ben geïnteresseerd in het product: ${productName}. Kunnen jullie meer informatie geven?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

    // Generate JSON-LD structured data for the product
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: productName,
      description: productDescription || productName,
      image:
        productData.productImages.length > 0
          ? productData.productImages.map((img: any) =>
              urlFor(img.asset).width(800).height(800).url()
            )
          : [],
      brand: {
        "@type": "Brand",
        name: "Devanshi Culture Shop",
      },
      category: categoryName || "Cultural Products",
      ...(productData.price && {
        offers: {
          "@type": "Offer",
          url: `https://devanshicultureshop.nl/${lang}/${category}/${product}`,
          priceCurrency: "EUR",
          price: productData.price.toFixed(2),
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Devanshi Culture Shop",
          },
          ...(productData.comparePrice &&
            productData.comparePrice > productData.price && {
              priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0], // 30 days from now
            }),
        },
      }),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "127",
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
        {
          "@type": "ListItem",
          position: 3,
          name: productName,
          item: `https://devanshicultureshop.nl/${lang}/${category}/${product}`,
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
        <Header currentLang={lang} />

        <main>
          {/* Product Details */}
          <section className="py-6 sm:py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb & Category */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-4">
                  {/* Mobile: Show only category link */}
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <Link
                      href={`/${lang}/${category}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← {categoryName}
                    </Link>
                    {/* Desktop: Show full breadcrumb */}
                    <div className="hidden sm:flex items-center space-x-2">
                      <span className="text-muted-foreground">•</span>
                      <Link
                        href={`/${lang}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {lang === "en" ? "Home" : "Home"}
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-foreground truncate max-w-[150px]">{productName}</span>
                    </div>
                  </div>
                  {categoryName && (
                    <Link
                      href={`/${lang}/${category}`}
                      className="hidden sm:inline-block text-xs font-medium text-primary/80 hover:text-primary transition-colors uppercase tracking-wider px-3 py-1 bg-primary/10 rounded-full"
                    >
                      {categoryName}
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                {/* Product Images - 2/3 width */}
                <div className="lg:col-span-2">
                  <ProductImageGallery
                    images={productData.productImages}
                    productName={productName}
                    currentLang={lang}
                  />
                </div>

                {/* Product Info - 1/3 width */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Product Name & Price */}
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                      {productName}
                    </h1>

                    {/* Pricing & Availability - Stack on mobile */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                      {productData.price && (
                        <div className="flex items-baseline space-x-2 sm:space-x-3">
                          <span className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                            €{productData.price.toFixed(2)}
                          </span>
                          {productData.comparePrice &&
                            productData.comparePrice > productData.price && (
                              <span className="font-sans text-sm sm:text-base md:text-lg text-muted-foreground line-through">
                                €{productData.comparePrice.toFixed(2)}
                              </span>
                            )}
                        </div>
                      )}

                      {/* Compact Availability Badge */}
                      <div
                        className={`inline-flex items-center space-x-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium self-start ${
                          productData.isAvailable
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            productData.isAvailable
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <span>
                          {productData.isAvailable
                            ? lang === "en"
                              ? "Available"
                              : "Beschikbaar"
                            : lang === "en"
                              ? "Not Available"
                              : "Niet Beschikbaar"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {productDescription && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {productDescription}
                      </p>
                    </div>
                  )}

                  {/* Primary Action */}
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 pt-3 sm:pt-4 border-t border-border/50">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 sm:space-x-3 py-3 sm:py-4 px-4 sm:px-6 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      <WhatsAppIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span>
                        {lang === "en"
                          ? "Inquire via WhatsApp"
                          : "Vraag via WhatsApp"}
                      </span>
                    </a>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <Link
                        href={`/${lang}/contact`}
                        className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 bg-background border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-xs sm:text-sm"
                      >
                        <MapPinIcon className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
                        <span>
                          {lang === "en" ? "Visit Store" : "Bezoek Winkel"}
                        </span>
                      </Link>

                      <ShareButton
                        title={productName}
                        url={`https://devanshicultureshop.nl/${lang}/${category}/${product}`}
                        currentLang={lang}
                      />
                    </div>
                  </div>

                  {/* Store Information - Collapsible */}
                  {storeSettings && (
                    <details className="group border border-border/50 rounded-xl overflow-hidden">
                      <summary className="cursor-pointer p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors list-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {lang === "en"
                              ? "Store Information"
                              : "Winkel Informatie"}
                          </span>
                          <svg
                            className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </summary>

                      <div className="p-4 space-y-3 text-sm">
                        {/* Address */}
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground mb-1">
                              {lang === "en" ? "Address" : "Adres"}
                            </p>
                            <div className="text-muted-foreground leading-relaxed">
                              {storeSettings.address[
                                lang as keyof typeof storeSettings.address
                              ]
                                .split("\n")
                                .map((line: string, index: number) => (
                                  <p
                                    key={index}
                                    className={index > 0 ? "mt-1" : ""}
                                  >
                                    {line}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Opening Hours */}
                        <div className="flex items-start space-x-3">
                          <ClockIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground mb-1">
                              {lang === "en" ? "Hours" : "Openingstijden"}
                            </p>
                            <div className="text-muted-foreground space-y-1">
                              {storeSettings.timings[
                                lang as keyof typeof storeSettings.timings
                              ]
                                .split("\n")
                                .map((line: string, index: number) => (
                                  <p key={index}>{line}</p>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Phone Numbers */}
                        <div className="flex items-start space-x-3">
                          <PhoneIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground mb-1">
                              {lang === "en" ? "Phone" : "Telefoon"}
                            </p>
                            <div className="space-y-1">
                              <a
                                href={`tel:${storeSettings.phoneMain}`}
                                className="block text-primary hover:text-primary/80 transition-colors font-medium"
                              >
                                {storeSettings.phoneMain}
                              </a>
                              {storeSettings.phoneSecondary && (
                                <a
                                  href={`tel:${storeSettings.phoneSecondary}`}
                                  className="block text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                  {storeSettings.phoneSecondary}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-8 sm:py-12 md:py-16 bg-secondary/30 border-t border-border/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 sm:mb-8 md:mb-12">
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
                    {lang === "en"
                      ? "You Might Also Like"
                      : "Dit Zou Je Ook Kunnen Bevallen"}
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                    {lang === "en"
                      ? `More from our ${categoryName?.toLowerCase()} collection`
                      : `Meer uit onze ${categoryName?.toLowerCase()} collectie`}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  {relatedProducts.map((relatedProduct: Product) => (
                    <ProductCard
                      key={relatedProduct._id}
                      product={relatedProduct}
                      currentLang={lang}
                      showCategory={false}
                    />
                  ))}
                </div>

                <div className="text-center mt-6 sm:mt-8 md:mt-12">
                  <Link
                    href={`/${lang}/${category}`}
                    className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] transform shadow-lg text-xs sm:text-sm md:text-base"
                  >
                    <span>
                      {lang === "en"
                        ? `View All ${categoryName}`
                        : `Bekijk Alle ${categoryName}`}
                    </span>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer currentLang={lang} />
      </>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    notFound();
  }
}
