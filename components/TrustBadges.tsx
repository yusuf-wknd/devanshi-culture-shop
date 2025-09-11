import {
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon,
  StarIcon,
  GiftIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

interface TrustBadge {
  icon: string;
  text: {
    en: string;
    nl: string;
  };
  description?: {
    en: string;
    nl: string;
  };
}

interface TrustBadgesProps {
  badges: TrustBadge[];
  currentLang: string;
}

// Icon mapping - you can extend this with more icons
const iconMap: { [key: string]: any } = {
  shield: ShieldCheckIcon,
  truck: TruckIcon,
  delivery: TruckIcon,
  heart: HeartIcon,
  star: StarIcon,
  gift: GiftIcon,
  check: CheckBadgeIcon,
  verified: CheckBadgeIcon,
  quality: ShieldCheckIcon,
  secure: ShieldCheckIcon,
  shipping: TruckIcon,
  support: HeartIcon,
  rating: StarIcon,
  guarantee: ShieldCheckIcon,
};

export default function TrustBadges({
  badges,
  currentLang = "en",
}: TrustBadgesProps) {
  if (!badges || badges.length === 0) {
    // Default trust badges if none provided
    const defaultBadges = [
      {
        icon: "shield",
        text: {
          en: "Authentic Products",
          nl: "Authentieke Producten",
        },
      },
      {
        icon: "truck",
        text: {
          en: "Fast Delivery",
          nl: "Snelle Levering",
        },
      },
      {
        icon: "heart",
        text: {
          en: "Customer Care",
          nl: "Klantenservice",
        },
      },
      {
        icon: "star",
        text: {
          en: "Top Quality",
          nl: "Topkwaliteit",
        },
      },
    ];
    badges = defaultBadges;
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName.toLowerCase()] || ShieldCheckIcon;
    return IconComponent;
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {currentLang === "en" ? "Why Choose Us" : "Waarom Voor Ons Kiezen"}
          </h3>
          <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
            {currentLang === "en"
              ? "We are committed to providing you with the best cultural shopping experience"
              : "Wij zijn toegewijd om u de beste culturele winkelervaring te bieden"}
          </p>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <div className="w-12 sm:w-16 h-px bg-primary"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
            <div className="w-12 sm:w-16 h-px bg-primary"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, index) => {
            const IconComponent = getIcon(badge.icon);
            const isEven = index % 2 === 0;
            const cardBg = isEven ? 'bg-secondary/10' : 'bg-primary/5';
            const hoverBg = isEven ? 'hover:bg-secondary/20' : 'hover:bg-primary/10';

            return (
              <div
                key={index}
                className={`group ${cardBg} ${hoverBg} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/30 hover:border-primary/30`}
              >
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  {/* Icon Container */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/15 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>

                  {/* Text */}
                  <div>
                    <h4 className="font-serif text-sm sm:text-lg font-semibold text-foreground mb-1">
                      {badge.text[currentLang as keyof typeof badge.text]}
                    </h4>
                    {badge.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {badge.description[currentLang as keyof typeof badge.description]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
