import { getAboutPage } from "@/sanity/lib/queries";
import type { AboutPage } from "@/sanity/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ValueCard from "@/components/ValueCard";
import ImpactStatistic from "@/components/ImpactStatistic";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  try {
    const aboutPage = await getAboutPage();

    if (!aboutPage) {
      return {
        title:
          lang === "en"
            ? "About Us - Devanshi Culture Shop"
            : "Over Ons - Devanshi Culture Shop",
        description:
          lang === "en"
            ? "Learn about Devanshi Culture Shop and our mission to bring authentic cultural products"
            : "Leer meer over Devanshi Culture Shop en onze missie om authentieke culturele producten te brengen",
      };
    }

    const title =
      aboutPage.seo?.metaTitle?.[lang as "en" | "nl"] ||
      `${aboutPage.heading[lang as "en" | "nl"]} - Devanshi Culture Shop`;

    const description =
      aboutPage.seo?.metaDescription?.[lang as "en" | "nl"] ||
      aboutPage.introduction[lang as "en" | "nl"] ||
      (lang === "en"
        ? "Learn about Devanshi Culture Shop and our mission to bring authentic cultural products"
        : "Leer meer over Devanshi Culture Shop en onze missie om authentieke culturele producten te brengen");

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        locale: lang,
      },
    };
  } catch (error) {
    return {
      title:
        lang === "en"
          ? "About Us - Devanshi Culture Shop"
          : "Over Ons - Devanshi Culture Shop",
      description:
        lang === "en"
          ? "Learn about Devanshi Culture Shop and our mission to bring authentic cultural products"
          : "Leer meer over Devanshi Culture Shop en onze missie om authentieke culturele producten te brengen",
    };
  }
}

// Custom components for PortableText rendering
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-sans text-lg text-muted-foreground mb-6 leading-relaxed">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-muted-foreground">{children}</em>
    ),
  },
};

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;

  try {
    const aboutPage = await getAboutPage().catch(() => null);

    // Generate Organization schema for about page
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Devanshi Culture Shop",
      url: `https://devanshicultureshop.nl/${lang}/about`,
      description:
        aboutPage?.introduction?.[lang as "en" | "nl"] ||
        (lang === "en"
          ? "Discover authentic cultural products and heritage items at Devanshi Culture Shop"
          : "Ontdek authentieke culturele producten en erfgoeditems bij Devanshi Culture Shop"),
      address: {
        "@type": "PostalAddress",
        streetAddress: "Culturele Straat 123",
        addressLocality: "Amsterdam",
        postalCode: "1012 AB",
        addressCountry: "NL",
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
        <Header currentLang={lang} />

        <main>
          {/* Hero Section */}
          <section
            className={`relative py-20 sm:py-24 lg:py-32 ${
              aboutPage?.heroImage
                ? "min-h-[80vh] flex items-center"
                : "bg-secondary/30"
            }`}
          >
            {/* Background Image */}
            {aboutPage?.heroImage && (
              <>
                <Image
                  src={urlFor(aboutPage.heroImage).url()}
                  alt={aboutPage.heroImage.alt || ""}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/60" />
              </>
            )}

            <div
              className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${
                aboutPage?.heroImage ? "text-white" : ""
              }`}
            >
              <h1
                className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 ${
                  aboutPage?.heroImage ? "text-white" : "text-foreground"
                }`}
              >
                {aboutPage?.heading?.[lang as "en" | "nl"] ||
                  (lang === "en"
                    ? "About Devanshi Culture Shop"
                    : "Over Devanshi Culture Shop")}
              </h1>

              {/* Decorative line */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div
                  className={`w-16 h-px ${
                    aboutPage?.heroImage ? "bg-white" : "bg-primary"
                  }`}
                ></div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    aboutPage?.heroImage ? "bg-white" : "bg-primary"
                  }`}
                ></div>
                <div
                  className={`w-16 h-px ${
                    aboutPage?.heroImage ? "bg-white" : "bg-primary"
                  }`}
                ></div>
              </div>

              <p
                className={`font-sans text-xl leading-relaxed max-w-3xl mx-auto ${
                  aboutPage?.heroImage
                    ? "text-white/90"
                    : "text-muted-foreground"
                }`}
              >
                {aboutPage?.introduction?.[lang as "en" | "nl"] ||
                  (lang === "en"
                    ? "Welcome to Devanshi Culture Shop, where tradition meets craftsmanship. We celebrate the rich heritage and authentic cultural products that tell stories of generations."
                    : "Welkom bij Devanshi Culture Shop, waar traditie en vakmanschap samenkomen. We vieren het rijke erfgoed en authentieke culturele producten die verhalen van generaties vertellen.")}
              </p>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16 sm:py-20 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  {aboutPage?.storyHeading?.[lang as "en" | "nl"] ||
                    (lang === "en" ? "Our Story" : "Ons Verhaal")}
                </h2>
              </div>

              <div className="prose prose-lg max-w-none">
                {aboutPage?.storyContent?.[lang as "en" | "nl"] &&
                aboutPage.storyContent[lang as "en" | "nl"].length > 0 ? (
                  <PortableText
                    value={aboutPage.storyContent[lang as "en" | "nl"]}
                    components={portableTextComponents}
                  />
                ) : (
                  <div className="text-center">
                    <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                      {lang === "en"
                        ? "Our story begins with a passion for preserving cultural heritage and bringing authentic products to those who appreciate tradition and quality craftsmanship."
                        : "Ons verhaal begint met een passie voor het behouden van cultureel erfgoed en het brengen van authentieke producten aan degenen die traditie en kwaliteitsvakmanschap waarderen."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 sm:py-20 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  {aboutPage?.valuesHeading?.[lang as "en" | "nl"] ||
                    (lang === "en" ? "Our Values" : "Onze Waarden")}
                </h2>
                <p className="font-sans text-lg text-muted-foreground max-w-3xl mx-auto">
                  {aboutPage?.valuesSubheading?.[lang as "en" | "nl"] ||
                    (lang === "en"
                      ? "The principles that guide everything we do"
                      : "De principes die alles wat we doen leiden")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aboutPage?.valuesList && aboutPage.valuesList.length > 0
                  ? aboutPage.valuesList.map((value: any, index: any) => (
                      <ValueCard
                        key={index}
                        title={value.valueTitle[lang as "en" | "nl"]}
                        description={
                          value.valueDescription[lang as "en" | "nl"]
                        }
                      />
                    ))
                  : // Fallback values
                    [
                      {
                        title:
                          lang === "en"
                            ? "Authentic Heritage"
                            : "Authentiek Erfgoed",
                        description:
                          lang === "en"
                            ? "We source genuine cultural products that preserve traditional craftsmanship"
                            : "We verkrijgen echte culturele producten die traditioneel vakmanschap behouden",
                      },
                      {
                        title:
                          lang === "en"
                            ? "Quality Craftsmanship"
                            : "Kwaliteitsvakmanschap",
                        description:
                          lang === "en"
                            ? "Every item is carefully selected for its superior quality and attention to detail"
                            : "Elk item wordt zorgvuldig geselecteerd vanwege zijn superieure kwaliteit en aandacht voor detail",
                      },
                      {
                        title:
                          lang === "en"
                            ? "Cultural Respect"
                            : "Cultureel Respect",
                        description:
                          lang === "en"
                            ? "We honor the traditions and stories behind each cultural artifact"
                            : "We eren de tradities en verhalen achter elk cultureel artefact",
                      },
                    ].map((value, index) => (
                      <ValueCard
                        key={index}
                        title={value.title}
                        description={value.description}
                      />
                    ))}
              </div>
            </div>
          </section>

          {/* Impact Section */}
          {aboutPage?.impactList && aboutPage.impactList.length > 0 && (
            <section className="py-16 sm:py-20 bg-background">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                    {aboutPage.impactHeading[lang as "en" | "nl"]}
                  </h2>
                  <p className="font-sans text-lg text-muted-foreground max-w-3xl mx-auto">
                    {aboutPage.impactSubheading[lang as "en" | "nl"]}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {aboutPage.impactList.map((impact: any, index: any) => (
                    <ImpactStatistic
                      key={index}
                      statistic={impact.impactStatistic}
                      label={impact.impactLabel[lang as "en" | "nl"]}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* What We Offer Section */}
          <section
            className={`relative py-16 sm:py-20 ${
              !aboutPage?.offerImage ? "bg-secondary/30" : ""
            }`}
          >
            {/* Background Image */}
            {aboutPage?.offerImage && (
              <Image
                src={urlFor(aboutPage.offerImage).url()}
                alt={aboutPage.offerImage.alt || ""}
                fill
                className="object-cover"
              />
            )}

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2
                  className={`font-serif text-3xl sm:text-4xl font-bold mb-6 ${
                    aboutPage?.offerImage ? "text-white" : "text-foreground"
                  }`}
                >
                  {aboutPage?.offerHeading?.[lang as "en" | "nl"] ||
                    (lang === "en" ? "What We Offer" : "Wat Wij Bieden")}
                </h2>
              </div>

              <div
                className={`rounded-2xl p-8 shadow-lg ${
                  aboutPage?.offerImage
                    ? "bg-background/10 backdrop-blur-sm border border-white/20"
                    : "bg-background border border-border/50"
                }`}
              >
                <ul className="space-y-4 text-lg">
                  {aboutPage?.offerList && aboutPage.offerList.length > 0
                    ? aboutPage.offerList.map((item: any, index: any) => (
                        <li key={index} className="flex items-start space-x-4">
                          <div
                            className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                              aboutPage?.offerImage ? "bg-white" : "bg-primary"
                            }`}
                          ></div>
                          <span
                            className={`leading-relaxed ${
                              aboutPage?.offerImage
                                ? "text-white/90"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item[lang as "en" | "nl"]}
                          </span>
                        </li>
                      ))
                    : // Fallback items
                      [
                        lang === "en"
                          ? "Handcrafted traditional jewelry and accessories"
                          : "Handgemaakte traditionele sieraden en accessoires",
                        lang === "en"
                          ? "Authentic textiles and fabrics from various cultures"
                          : "Authentieke textiel en stoffen uit verschillende culturen",
                        lang === "en"
                          ? "Unique art pieces and decorative items"
                          : "Unieke kunstwerken en decoratieve items",
                        lang === "en"
                          ? "Cultural instruments and ceremonial objects"
                          : "Culturele instrumenten en ceremoniële objecten",
                        lang === "en"
                          ? "Expert consultation on cultural significance"
                          : "Deskundige consultatie over culturele betekenis",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start space-x-4">
                          <div
                            className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                              aboutPage?.offerImage ? "bg-white" : "bg-primary"
                            }`}
                          ></div>
                          <span
                            className={`leading-relaxed ${
                              aboutPage?.offerImage
                                ? "text-white/90"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 sm:py-20 bg-primary/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                {aboutPage?.visitHeading?.[lang as "en" | "nl"] ||
                  (lang === "en" ? "Visit Us Today" : "Bezoek Ons Vandaag")}
              </h2>

              <p className="font-sans text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                {aboutPage?.visitText?.[lang as "en" | "nl"] ||
                  (lang === "en"
                    ? "Come discover our collection of authentic cultural products. Experience the beauty and craftsmanship of traditional items that tell the stories of cultures from around the world."
                    : "Kom onze collectie authentieke culturele producten ontdekken. Ervaar de schoonheid en het vakmanschap van traditionele items die de verhalen van culturen van over de hele wereld vertellen.")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={`/${lang}/categories`}
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 transform shadow-lg"
                >
                  <span>
                    {lang === "en"
                      ? "Explore Our Products"
                      : "Ontdek Onze Producten"}
                  </span>
                </Link>

                <Link
                  href={`/${lang}`}
                  className="inline-flex items-center space-x-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-medium hover:bg-accent transition-colors border border-border"
                >
                  <span>
                    {lang === "en" ? "Visit Our Store" : "Bezoek Onze Winkel"}
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer currentLang={lang} />
        <WhatsAppButton currentLang={lang} />
      </>
    );
  } catch (error) {
    console.error("Error loading about page:", error);
    // Return fallback page content
    return (
      <>
        <Header currentLang={lang} />
        <main>
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-8">
                {lang === "en"
                  ? "About Devanshi Culture Shop"
                  : "Over Devanshi Culture Shop"}
              </h1>
              <p className="font-sans text-xl text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? "We are currently updating our about page. Please check back soon!"
                  : "We werken momenteel onze over ons pagina bij. Kom binnenkort terug!"}
              </p>
            </div>
          </section>
        </main>
        <Footer currentLang={lang} />
        <WhatsAppButton currentLang={lang} />
      </>
    );
  }
}
