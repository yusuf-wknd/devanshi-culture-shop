import { PortableText } from "@portabletext/react";

interface WelcomeContent {
  en: any[]; // Portable Text blocks
  nl: any[]; // Portable Text blocks
}

interface WelcomeHeading {
  en: string;
  nl: string;
}

interface WelcomeSectionProps {
  heading: WelcomeHeading;
  body: WelcomeContent;
  currentLang: string;
}

// Custom components for PortableText rendering
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-sans text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-muted-foreground">{children}</em>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        target={value.blank ? "_blank" : "_self"}
        rel={value.blank ? "noopener noreferrer" : ""}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-6 ml-4">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 ml-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="font-sans text-base sm:text-lg text-muted-foreground">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="font-sans text-base sm:text-lg text-muted-foreground">{children}</li>
    ),
  },
};

export default function WelcomeSection({
  heading,
  body,
  currentLang = "en",
}: WelcomeSectionProps) {
  const currentHeading = heading[currentLang as keyof typeof heading];
  const currentBody = body[currentLang as keyof typeof body];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            {currentHeading}
          </h2>

          {/* Decorative line */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
            <div className="w-12 sm:w-16 h-px bg-primary"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
            <div className="w-12 sm:w-16 h-px bg-primary"></div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {currentBody && currentBody.length > 0 ? (
            <PortableText
              value={currentBody}
              components={portableTextComponents}
            />
          ) : (
            <div className="text-center">
              <p className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {currentLang === "en"
                  ? "Welcome to Devanshi Culture Shop, where tradition meets craftsmanship. We celebrate the rich heritage and authentic cultural products that tell stories of generations past and present."
                  : "Welkom bij Devanshi Culture Shop, waar traditie en vakmanschap samenkomen. We vieren het rijke erfgoed en authentieke culturele producten die verhalen vertellen van generaties uit het verleden en heden."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
