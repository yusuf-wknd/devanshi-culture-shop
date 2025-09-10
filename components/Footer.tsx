import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

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

export default function Footer({
  storeSection,
  currentLang = "en",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navigation = {
    shop: [
      { name: "Products", href: `/${currentLang}/products` },
      { name: "Categories", href: `/${currentLang}/categories` },
      { name: "New Arrivals", href: `/${currentLang}/products?filter=new` },
      { name: "Best Sellers", href: `/${currentLang}/products?filter=popular` },
    ],
    company: [
      { name: "About Us", href: `/${currentLang}/about` },
      { name: "Our Story", href: `/${currentLang}/about#story` },
      { name: "Visit Store", href: `/${currentLang}/visit` },
      { name: "Contact", href: `/${currentLang}/contact` },
    ],
    support: [
      { name: "FAQ", href: `/${currentLang}/faq` },
      { name: "Shipping Info", href: `/${currentLang}/shipping` },
      { name: "Returns", href: `/${currentLang}/returns` },
      { name: "Size Guide", href: `/${currentLang}/size-guide` },
    ],
  };

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href={`/${currentLang}`}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-serif font-bold text-lg">
                  D
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary">
                  Devanshi
                </h3>
                <p className="font-sans text-xs text-muted-foreground -mt-1">
                  Culture Shop
                </p>
              </div>
            </Link>
            <p className="text-muted-foreground font-sans text-sm max-w-sm">
              {currentLang === "en"
                ? "Discover authentic cultural products and heritage items. Your gateway to tradition and craftsmanship."
                : "Ontdek authentieke culturele producten en erfgoeditems. Uw toegang tot traditie en vakmanschap."}
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons Placeholder */}
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <span className="text-xs">FB</span>
              </div>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <span className="text-xs">IG</span>
              </div>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <span className="text-xs">WA</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">
              {currentLang === "en" ? "Shop" : "Winkel"}
            </h4>
            <ul className="space-y-3">
              {navigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-sans text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">
              {currentLang === "en" ? "Company" : "Bedrijf"}
            </h4>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-sans text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Information */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">
              {currentLang === "en" ? "Visit Us" : "Bezoek Ons"}
            </h4>
            <div className="space-y-3">
              {storeSection?.address && (
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground font-sans text-sm">
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
                  <ClockIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground font-sans text-sm">
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
                  <PhoneIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground font-sans text-sm">
                    {
                      storeSection.contactInfo[
                        currentLang as keyof typeof storeSection.contactInfo
                      ]
                    }
                  </p>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@devanshicultureshop.nl"
                  className="text-muted-foreground hover:text-primary transition-colors font-sans text-sm"
                >
                  info@devanshicultureshop.nl
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-muted-foreground font-sans text-sm">
              © {currentYear} Devanshi Culture Shop.{" "}
              {currentLang === "en"
                ? "All rights reserved."
                : "Alle rechten voorbehouden."}
            </p>

            <div className="flex items-center space-x-1 text-muted-foreground font-sans text-sm">
              <span>{currentLang === "en" ? "Made with" : "Gemaakt met"}</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
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
