import type { Metadata } from "next";
import { Fraunces, Open_Sans } from "next/font/google";
import "../globals.css";
import { getHomePage } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const locales = ['en', 'nl']

// Generate metadata based on language and page data
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params
  
  try {
    const homePage = await getHomePage()
    const title = homePage?.seo?.metaTitle?.[lang as 'en' | 'nl'] || "Devanshi Culture Shop"
    const description = homePage?.seo?.metaDescription?.[lang as 'en' | 'nl'] || 
      (lang === 'nl' 
        ? "Ontdek authentieke culturele producten en erfgoeditems bij Devanshi Culture Shop"
        : "Discover authentic cultural products and heritage items at Devanshi Culture Shop"
      )

    return {
      title,
      description,
      alternates: {
        languages: {
          'en': '/en',
          'nl': '/nl',
        }
      },
      openGraph: {
        title,
        description,
        locale: lang,
        alternateLocale: lang === 'en' ? 'nl' : 'en',
      }
    }
  } catch (error) {
    // Fallback metadata if Sanity is not available
    return {
      title: "Devanshi Culture Shop",
      description: lang === 'nl' 
        ? "Ontdek authentieke culturele producten en erfgoeditems bij Devanshi Culture Shop"
        : "Discover authentic cultural products and heritage items at Devanshi Culture Shop",
    }
  }
}

// Generate static params for supported languages
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params
  
  // Validate that the language is supported
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang}>
      <body
        className={`${fraunces.variable} ${openSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}