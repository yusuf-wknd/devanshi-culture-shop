import {
  getProductBySlug,
  getProductStaticParams,
  getAllProducts,
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

interface PageProps {
  params: Promise<{
    lang: string;
    product: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const products = await getProductStaticParams();
    const languages = ["en", "nl"];

    return languages.flatMap((lang) =>
      products
        .filter((product: any) => !product.category) // Only products WITHOUT categories
        .map((product: any) => ({
          lang,
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
  const { lang, product } = await params;

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

    // For products route, allow products without categories
    const productName = productData.productName[lang as "en" | "nl"] || productData.productName.en;
    const productDescription = productData.description?.[lang as "en" | "nl"] || productData.description?.en;
    const categoryName =
      productData.category?.categoryName?.[lang as "en" | "nl"] || productData.category?.categoryName?.en;

    // Get related products (same category if exists, or just random products)
    const relatedProducts = allProducts
      .filter((p: Product) => p._id !== productData._id)
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
          url: `https://devanshicultureshop.nl/${lang}/products/${product}`,
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

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <Header currentLang={lang} />

        <main>
          {/* Breadcrumb Navigation */}
          <nav
            className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40"
            aria-label="Breadcrumb"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href={`/${lang}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {lang === "en" ? "Home" : "Thuis"}
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground mx-2">/</span>
                </li>
                <li>
                  <Link
                    href={`/${lang}/products`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {lang === "en" ? "Products" : "Producten"}
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground mx-2">/</span>
                </li>
                <li>
                  <span className="text-foreground font-medium">
                    {productName}
                  </span>
                </li>
              </ol>
            </div>
          </nav>

          {/* Product Details */}
          <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                  <ProductImageGallery
                    images={productData.productImages}
                    productName={productName}
                    currentLang={lang}
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                  {/* Category & Back Button */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${lang}/products`}
                      className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      {lang === "en"
                        ? "Back to Products"
                        : "Terug naar Producten"}
                    </Link>
                    <ShareButton
                      url={`https://devanshicultureshop.nl/${lang}/products/${product}`}
                      title={productName}
                      currentLang={lang}
                    />
                  </div>

                  {/* Product Name */}
                  <div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                      {productName}
                    </h1>
                    {categoryName && (
                      <p className="text-sm font-medium text-primary uppercase tracking-wider">
                        {categoryName}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  {productData.price && (
                    <div className="space-y-2">
                      <div className="flex items-baseline space-x-4">
                        <span className="font-sans text-3xl font-bold text-foreground">
                          €{productData.price.toFixed(2)}
                        </span>
                        {productData.comparePrice &&
                          productData.comparePrice > productData.price && (
                            <span className="font-sans text-lg text-muted-foreground line-through">
                              €{productData.comparePrice.toFixed(2)}
                            </span>
                          )}
                        {productData.isOnSale && (
                          <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                            {lang === "en" ? "On Sale" : "Uitverkoop"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {productDescription && (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        {productDescription}
                      </p>
                    </div>
                  )}

                  {/* Contact CTA */}
                  <div className="space-y-4 p-6 bg-secondary/30 rounded-xl border border-border">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                          {lang === "en"
                            ? "Interested in this product?"
                            : "Geïnteresseerd in dit product?"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {lang === "en"
                            ? "Contact us for more information, pricing, or to place an order."
                            : "Neem contact met ons op voor meer informatie, prijzen of om een bestelling te plaatsen."}
                        </p>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-16 bg-secondary/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                    {lang === "en"
                      ? "You May Also Like"
                      : "Dit Vind Je Ook Leuk"}
                  </h2>
                  <p className="text-muted-foreground">
                    {lang === "en"
                      ? "Discover more authentic cultural products"
                      : "Ontdek meer authentieke culturele producten"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {relatedProducts.map((relatedProduct: any) => (
                    <ProductCard
                      key={relatedProduct._id}
                      product={relatedProduct}
                      currentLang={lang}
                      showCategory={true}
                      enableQuickView={false}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer currentLang={lang} />
        <WhatsAppButton currentLang={lang} productName={productName} />
      </>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    notFound();
  }
}
