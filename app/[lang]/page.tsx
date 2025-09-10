import { getHomePage, getAllCategories } from "@/sanity/lib/queries";
import type { HomePage, Category } from "@/sanity/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import WelcomeSection from "@/components/WelcomeSection";
import TrustBadges from "@/components/TrustBadges";
import CategoryShowcase from "@/components/CategoryShowcase";
import VisitStore from "@/components/VisitStore";
import WhatsAppButton from "@/components/WhatsAppButton";

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  // Fetch data in parallel for better performance
  const [homePage, categories] = await Promise.all([
    getHomePage().catch(() => null),
    getAllCategories().catch(() => []),
  ]);

  // Organization schema for homepage
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Devanshi Culture Shop",
    url: `https://devanshicultureshop.nl/${lang}`,
    logo: "https://devanshicultureshop.nl/logo.png",
    description:
      lang === "en"
        ? "Discover authentic cultural products and heritage items at Devanshi Culture Shop"
        : "Ontdek authentieke culturele producten en erfgoeditems bij Devanshi Culture Shop",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Culturele Straat 123",
      addressLocality: "Amsterdam",
      postalCode: "1012 AB",
      addressCountry: "NL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+31 20 123 4567",
      contactType: "customer service",
      availableLanguage: ["English", "Dutch"],
    },
    sameAs: ["https://wa.me/31612345678"],
  };

  // Website schema
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Devanshi Culture Shop",
    url: `https://devanshicultureshop.nl/${lang}`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://devanshicultureshop.nl/${lang}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
      <Header currentLang={lang} />

      <main>
        {/* Hero Slider */}
        {homePage?.heroSlides && homePage.heroSlides.length > 0 ? (
          <HeroSlider slides={homePage.heroSlides} currentLang={lang} />
        ) : (
          // Fallback hero section if no slides are configured
          <section className="relative h-[70vh] bg-secondary/30 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {lang === "en"
                  ? "Welcome to Devanshi Culture Shop"
                  : "Welkom bij Devanshi Culture Shop"}
              </h1>
              <p className="font-sans text-lg text-muted-foreground mb-8">
                {lang === "en"
                  ? "Discover authentic cultural products and heritage items"
                  : "Ontdek authentieke culturele producten en erfgoeditems"}
              </p>
            </div>
          </section>
        )}

        {/* Welcome Section */}
        <WelcomeSection
          heading={
            homePage?.welcomeHeading || {
              en: "Our Story",
              nl: "Ons Verhaal",
            }
          }
          body={
            homePage?.welcomeBody || {
              en: [],
              nl: [],
            }
          }
          currentLang={lang}
        />

        {/* Category Showcase */}
        <CategoryShowcase
          categories={categories}
          currentLang={lang}
          maxItems={6}
          title={{
            en: "Explore Our Categories",
            nl: "Ontdek Onze Categorieën",
          }}
        />

        {/* Trust Badges */}
        <TrustBadges badges={homePage?.trustBadges || []} currentLang={lang} />

        {/* Visit Store */}
        {homePage?.storeSection && (
          <VisitStore storeSection={homePage.storeSection} currentLang={lang} />
        )}
      </main>

      <Footer currentLang={lang} />
      <WhatsAppButton currentLang={lang} />
    </>
  );
}
