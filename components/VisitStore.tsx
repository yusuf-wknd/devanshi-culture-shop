import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { urlFor } from "@/sanity/lib/image";

interface SanityImage {
  asset: {
    _id: string;
    url: string;
  };
  alt: string;
}

interface TranslatableText {
  en: string;
  nl: string;
}

interface StoreSection {
  storeImage: SanityImage;
  address: TranslatableText;
  timings: TranslatableText;
  contactInfo: TranslatableText;
}

interface VisitStoreProps {
  storeSection: StoreSection;
  currentLang: string;
  className?: string;
}

export default function VisitStore({
  storeSection,
  currentLang = "en",
  className = "",
}: VisitStoreProps) {

  return (
    <section className={`py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            {currentLang === "en" ? "Visit Our Store" : "Bezoek Onze Winkel"}
          </h2>
          <p className="font-sans text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8">
            {currentLang === "en"
              ? "Experience our cultural treasures in person. Visit our store to see, touch, and feel the authentic quality of our products."
              : "Ervaar onze culturele schatten persoonlijk. Bezoek onze winkel om de authentieke kwaliteit van onze producten te zien, voelen en beleven."}
          </p>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <div className="w-12 sm:w-16 h-px bg-primary"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
            <div className="w-12 sm:w-16 h-px bg-primary"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Store Image */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={urlFor(storeSection.storeImage.asset).width(600).height(400).url()}
                alt={storeSection.storeImage.alt}
                width={600}
                height={400}
                className="object-cover w-full h-[300px] sm:h-[400px]"
              />
            </div>
          </div>

          {/* Store Information */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            {/* Address */}
            <div className="bg-background rounded-xl p-4 sm:p-5 border border-border/30 hover:border-primary/30 transition-colors duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2">
                    {currentLang === "en" ? "Address" : "Adres"}
                  </h3>
                  <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {storeSection.address[currentLang as keyof typeof storeSection.address]
                      .split('\n')
                      .map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-1' : ''}>
                          {line}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-background rounded-xl p-4 sm:p-5 border border-border/30 hover:border-primary/30 transition-colors duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2">
                    {currentLang === "en" ? "Contact" : "Contact"}
                  </h3>
                  <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {storeSection.contactInfo[currentLang as keyof typeof storeSection.contactInfo]
                      .split('\n')
                      .map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-1' : ''}>
                          {line}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="bg-background rounded-xl p-4 sm:p-5 border border-border/30 hover:border-primary/30 transition-colors duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2">
                    {currentLang === "en" ? "Opening Hours" : "Openingstijden"}
                  </h3>
                  <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {storeSection.timings[currentLang as keyof typeof storeSection.timings]
                      .split('\n')
                      .map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-1' : ''}>
                          {line}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <div className="pt-4 text-center sm:text-left">
              <Link
                href={`/${currentLang}/contact`}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold"
              >
                <span>
                  {currentLang === "en" ? "Get Directions" : "Route Krijgen"}
                </span>
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
