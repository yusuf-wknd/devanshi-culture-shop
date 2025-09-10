import { getStoreSettings } from "@/sanity/lib/queries";
import type { StoreSettings } from "@/sanity/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
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

  return {
    title:
      lang === "en"
        ? "Contact Us - Devanshi Culture Shop"
        : "Contact Ons - Devanshi Culture Shop",
    description:
      lang === "en"
        ? "Get in touch with Devanshi Culture Shop. Visit our store in Amsterdam or contact us for authentic cultural products and inquiries."
        : "Neem contact op met Devanshi Culture Shop. Bezoek onze winkel in Amsterdam of neem contact met ons op voor authentieke culturele producten en vragen.",
    openGraph: {
      title:
        lang === "en"
          ? "Contact Us - Devanshi Culture Shop"
          : "Contact Ons - Devanshi Culture Shop",
      description:
        lang === "en"
          ? "Get in touch with Devanshi Culture Shop. Visit our store in Amsterdam or contact us for authentic cultural products and inquiries."
          : "Neem contact op met Devanshi Culture Shop. Bezoek onze winkel in Amsterdam of neem contact met ons op voor authentieke culturele producten en vragen.",
      locale: lang,
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;

  try {
    const storeSettings = await getStoreSettings().catch(() => null);

    // Generate LocalBusiness schema for contact page
    const businessData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Devanshi Culture Shop",
      url: `https://devanshicultureshop.nl/${lang}/contact`,
      telephone: storeSettings?.phoneMain || "+31123456789",
      email: storeSettings?.email || "info@devanshicultureshop.nl",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Anton de Komplein 160",
        addressLocality: "Amsterdam",
        postalCode: "1102 BP",
        addressCountry: "NL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 52.31573216869728,
        longitude: 4.955045014717738,
      },
      openingHours:
        storeSettings?.timings?.[lang as "en" | "nl"] ||
        (lang === "en" ? "Mo-Sa 10:00-18:00" : "Ma-Za 10:00-18:00"),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessData),
          }}
        />
        <Header currentLang={lang} />

        <main>
          {/* Hero Section */}
          <section className="py-16 sm:py-20 lg:py-24 bg-secondary/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8">
                {lang === "en" ? "Contact Us" : "Contact Ons"}
              </h1>

              {/* Decorative line */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-16 h-px bg-primary"></div>
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="w-16 h-px bg-primary"></div>
              </div>

              <p className="font-sans text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {lang === "en"
                  ? "We'd love to hear from you. Visit our store, give us a call, or send us a message to learn more about our authentic cultural products."
                  : "We horen graag van u. Bezoek onze winkel, bel ons of stuur ons een bericht om meer te weten te komen over onze authentieke culturele producten."}
              </p>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="py-16 sm:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Contact Details */}
                <div className="space-y-8">
                  {/* Store Address */}
                  <div className="bg-secondary/20 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">
                          {lang === "en"
                            ? "Visit Our Store"
                            : "Bezoek Onze Winkel"}
                        </h3>
                        <address className="text-muted-foreground not-italic leading-relaxed">
                          {storeSettings?.address?.[lang as "en" | "nl"] ? (
                            <div className="whitespace-pre-line">
                              {storeSettings.address[lang as "en" | "nl"]}
                            </div>
                          ) : (
                            <>
                              Anton de Komplein 160
                              <br />
                              1102 BP Amsterdam
                              <br />
                              Netherlands
                            </>
                          )}
                        </address>
                      </div>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="bg-secondary/20 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">
                          {lang === "en" ? "Call Us" : "Bel Ons"}
                        </h3>
                        <div className="space-y-1">
                          <a
                            href={`tel:${storeSettings?.phoneMain || "+31123456789"}`}
                            className="block text-muted-foreground hover:text-primary transition-colors"
                          >
                            {storeSettings?.phoneMain || "+31 12 345 6789"}
                          </a>
                          {storeSettings?.phoneSecondary && (
                            <a
                              href={`tel:${storeSettings.phoneSecondary}`}
                              className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                            >
                              {storeSettings.phoneSecondary}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-secondary/20 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">
                          {lang === "en" ? "Email Us" : "E-mail Ons"}
                        </h3>
                        <a
                          href={`mailto:${storeSettings?.email || "info@devanshicultureshop.nl"}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {storeSettings?.email ||
                            "info@devanshicultureshop.nl"}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="bg-secondary/20 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-2">
                          {lang === "en" ? "Opening Hours" : "Openingstijden"}
                        </h3>
                        <div className="text-muted-foreground whitespace-pre-line">
                          {storeSettings?.timings?.[lang as "en" | "nl"] ||
                            (lang === "en"
                              ? "Monday - Saturday: 10:00 - 18:00\nSunday: Closed"
                              : "Maandag - Zaterdag: 10:00 - 18:00\nZondag: Gesloten")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Image */}
                {storeSettings?.storeImage &&
                  storeSettings.storeImage.asset && (
                    <div className="lg:order-first">
                      <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                        <Image
                          src={storeSettings.storeImage.asset.url}
                          alt={
                            storeSettings.storeImage.alt ||
                            "Devanshi Culture Shop"
                          }
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </section>

          {/* Google Maps Section */}
          <section className="py-16 sm:py-20 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  {lang === "en" ? "Find Us Here" : "Vind Ons Hier"}
                </h2>
                <p className="font-sans text-lg text-muted-foreground max-w-3xl mx-auto">
                  {lang === "en"
                    ? "Located in the heart of Amsterdam, our store is easily accessible by public transport and car."
                    : "Gelegen in het hart van Amsterdam, onze winkel is gemakkelijk bereikbaar met het openbaar vervoer en de auto."}
                </p>
              </div>

              <div className="bg-background rounded-2xl p-8 shadow-lg border border-border/50">
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d152.43843110003021!2d4.955045014717738!3d52.31573216869728!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c60b8e7d94a449%3A0xd03e035b662bd809!2sAnton%20de%20Komplein%20160%2C%201102%20BP%20Amsterdam%2C%20Netherlands!5e0!3m2!1sen!2sus!4v1757505121609!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={
                      lang === "en"
                        ? "Devanshi Culture Shop Location"
                        : "Devanshi Culture Shop Locatie"
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Quick Contact Section */}
          <section className="py-16 sm:py-20 bg-primary/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                {lang === "en" ? "Ready to Explore?" : "Klaar om te Ontdekken?"}
              </h2>

              <p className="font-sans text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                {lang === "en"
                  ? "Have questions about our cultural products or need personalized recommendations? We're here to help you find the perfect authentic pieces."
                  : "Heeft u vragen over onze culturele producten of heeft u gepersonaliseerde aanbevelingen nodig? We helpen u graag bij het vinden van de perfecte authentieke stukken."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={`tel:${storeSettings?.phoneMain || "+31123456789"}`}
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 transform shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{lang === "en" ? "Call Now" : "Bel Nu"}</span>
                </a>

                <a
                  href={`mailto:${storeSettings?.email || "info@devanshicultureshop.nl"}`}
                  className="inline-flex items-center space-x-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-medium hover:bg-accent transition-colors border border-border"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{lang === "en" ? "Send Email" : "Stuur E-mail"}</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer currentLang={lang} />
        <WhatsAppButton currentLang={lang} />
      </>
    );
  } catch (error) {
    console.error("Error loading contact page:", error);
    // Return fallback contact page
    return (
      <>
        <Header currentLang={lang} />
        <main>
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-8">
                {lang === "en" ? "Contact Us" : "Contact Ons"}
              </h1>
              <p className="font-sans text-xl text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? "We are currently updating our contact information. Please check back soon!"
                  : "We werken momenteel onze contactinformatie bij. Kom binnenkort terug!"}
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
