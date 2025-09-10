import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { getAllCategories } from "@/sanity/lib/queries";
import type { Category } from "@/sanity/lib/queries";

// Social Media Icons
const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.696" />
  </svg>
);

interface StoreSection {
  storeImage?: {
    asset: any;
    alt: string;
  };
  address?: {
    en: string;
    nl: string;
  };
  timings?: {
    en: string;
    nl: string;
  };
  contactInfo?: {
    en: string;
    nl: string;
  };
}

interface FooterProps {
  storeSection?: StoreSection;
  currentLang: string;
}

export default async function Footer({
  storeSection,
  currentLang = "en",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Fetch categories from Sanity
  const allCategories = await getAllCategories().catch(() => []);
  const topCategories = allCategories.slice(0, 3);

  const navigation = {
    shop: [
      // Dynamic categories from Sanity
      ...topCategories.map((category: Category) => ({
        name: {
          en: category.categoryName.en,
          nl: category.categoryName.nl,
        },
        href: `/${currentLang}/${category.slug.current}`,
      })),
      // All categories link
      {
        name: {
          en: "All Categories",
          nl: "Alle Categorieën",
        },
        href: `/${currentLang}/categories`,
      },
    ],
    company: [
      {
        name: {
          en: "About Us",
          nl: "Over Ons",
        },
        href: `/${currentLang}/about`,
      },
      {
        name: {
          en: "Our Story",
          nl: "Ons Verhaal",
        },
        href: `/${currentLang}/about#story`,
      },
      {
        name: {
          en: "Contact",
          nl: "Contact",
        },
        href: `/${currentLang}/contact`,
      },
    ],
  };

  return (
    <footer className="bg-primary border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href={`/${currentLang}`}
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="Devanshi Culture Shop"
                width={420}
                height={96}
                className="h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-primary-foreground/70 font-sans text-sm max-w-sm">
              {currentLang === "en"
                ? "Discover authentic cultural products and heritage items. Your gateway to tradition and craftsmanship."
                : "Ontdek authentieke culturele producten en erfgoeditems. Uw toegang tot traditie en vakmanschap."}
            </p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/p/Devanshi-Culture-Shop-100090842495531/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-[#1877f2] hover:text-white transition-colors text-primary-foreground"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/31618264718"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-[#25d366] hover:text-white transition-colors text-primary-foreground"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">
              {currentLang === "en" ? "Shop" : "Winkel"}
            </h4>
            <ul className="space-y-3">
              {navigation.shop.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors font-sans text-sm"
                  >
                    {typeof item.name === "object"
                      ? item.name[currentLang as keyof typeof item.name]
                      : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">
              {currentLang === "en" ? "Company" : "Bedrijf"}
            </h4>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors font-sans text-sm"
                  >
                    {typeof item.name === "object"
                      ? item.name[currentLang as keyof typeof item.name]
                      : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Information */}
          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">
              {currentLang === "en" ? "Visit Us" : "Bezoek Ons"}
            </h4>
            <div className="space-y-3">
              {storeSection?.address && (
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-primary-foreground/70 font-sans text-sm">
                    {
                      storeSection.address[
                        currentLang as keyof typeof storeSection.address
                      ]
                    }
                  </p>
                </div>
              )}

              {storeSection?.timings && (
                <div className="flex items-start space-x-3">
                  <ClockIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-primary-foreground/70 font-sans text-sm">
                    {
                      storeSection.timings[
                        currentLang as keyof typeof storeSection.timings
                      ]
                    }
                  </p>
                </div>
              )}

              {storeSection?.contactInfo && (
                <div className="flex items-start space-x-3">
                  <PhoneIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-primary-foreground/70 font-sans text-sm">
                    {
                      storeSection.contactInfo[
                        currentLang as keyof typeof storeSection.contactInfo
                      ]
                    }
                  </p>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@devanshicultureshop.nl"
                  className="text-primary-foreground/70 hover:text-accent transition-colors font-sans text-sm"
                >
                  info@devanshicultureshop.nl
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-primary-foreground/70 font-sans text-sm">
              © {currentYear} Devanshi Culture Shop.{" "}
              {currentLang === "en"
                ? "All rights reserved."
                : "Alle rechten voorbehouden."}
            </p>

            <div className="flex items-center space-x-1 text-primary-foreground/70 font-sans text-sm">
              <span>{currentLang === "en" ? "Made with" : "Gemaakt met"}</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
              <span>{currentLang === "en" ? "by" : "door"}</span>
              <a
                href="https://weekendlabs.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Weekend Labs
              </a>
              <span>
                {currentLang === "en"
                  ? "for cultural heritage"
                  : "voor cultureel erfgoed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
