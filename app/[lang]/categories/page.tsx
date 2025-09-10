import { getAllCategories } from "@/sanity/lib/queries"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CategoryShowcase from "@/components/CategoryShowcase"
import WhatsAppButton from "@/components/WhatsAppButton"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  
  const title = lang === 'en' ? 'All Categories - Devanshi Culture Shop' : 'Alle Categorieën - Devanshi Culture Shop'
  const description = lang === 'en' 
    ? 'Browse all our cultural product categories and discover authentic items from various traditions'
    : 'Bekijk al onze culturele productcategorieën en ontdek authentieke items uit verschillende tradities'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: lang,
    }
  }
}

export default async function CategoriesPage({ params }: PageProps) {
  const { lang } = await params
  
  // Fetch all categories
  const categories = await getAllCategories().catch(() => [])

  return (
    <>
      <Header currentLang={lang} />
      
      <main>
        {/* Page Header */}
        <section className="relative py-16 sm:py-20 min-h-[60vh] flex items-center" 
                 style={{
                   backgroundImage: 'url(/categories.png)',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                {lang === 'en' ? 'All Categories' : 'Alle Categorieën'}
              </h1>
              <p className="font-sans text-lg text-white/90 max-w-3xl mx-auto">
                {lang === 'en' 
                  ? 'Explore our complete collection of cultural products organized by category'
                  : 'Ontdek onze complete collectie culturele producten georganiseerd per categorie'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <CategoryShowcase 
          categories={categories}
          currentLang={lang}
          showAll={false}
          className="bg-background"
        />

        {/* Additional Info Section */}
        {categories.length === 0 && (
          <section className="py-16 bg-secondary/30">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                {lang === 'en' ? 'Categories Coming Soon' : 'Categorieën Komen Binnenkort'}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                {lang === 'en' 
                  ? 'We are currently organizing our cultural products into categories. Please check back soon!'
                  : 'We organiseren momenteel onze culturele producten in categorieën. Kom binnenkort terug!'
                }
              </p>
              <div className="inline-flex items-center space-x-4">
                <div className="w-8 h-px bg-accent"></div>
                <span className="font-serif text-sm text-accent font-medium tracking-wider uppercase">
                  {lang === 'en' ? 'More Products Coming Soon' : 'Meer Producten Komen Binnenkort'}
                </span>
                <div className="w-8 h-px bg-accent"></div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer currentLang={lang} />
      <WhatsAppButton currentLang={lang} />
    </>
  )
}