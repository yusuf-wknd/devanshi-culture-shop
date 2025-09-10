import { searchProducts } from "@/sanity/lib/queries"
import type { Product } from "@/sanity/lib/queries"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductGrid from "@/components/ProductGrid"
import WhatsAppButton from "@/components/WhatsAppButton"
import SearchInput from "@/components/SearchInput"
import Link from "next/link"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const { q } = await searchParams
  
  const title = q 
    ? (lang === 'en' 
        ? `Search Results for "${q}" - Devanshi Culture Shop`
        : `Zoekresultaten voor "${q}" - Devanshi Culture Shop`
      )
    : (lang === 'en' 
        ? 'Search Products - Devanshi Culture Shop'
        : 'Zoek Producten - Devanshi Culture Shop'
      )
  
  const description = lang === 'en' 
    ? 'Search through our collection of authentic cultural products and heritage items'
    : 'Zoek door onze collectie authentieke culturele producten en erfgoeditems'

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

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { lang } = await params
  const { q } = await searchParams
  
  let products: Product[] = []
  let hasSearched = false
  let isLoading = false
  
  // Only search if there's a query parameter
  if (q && q.trim()) {
    hasSearched = true
    isLoading = true
    try {
      products = await searchProducts(q.trim())
    } catch (error) {
      console.error('Error searching products:', error)
      products = []
    }
    isLoading = false
  }

  return (
    <>
      <Header currentLang={lang} />
      
      <main>
        {/* Search Header */}
        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {hasSearched 
                  ? (lang === 'en' ? 'Search Results' : 'Zoekresultaten')
                  : (lang === 'en' ? 'Search Products' : 'Zoek Producten')
                }
              </h1>
              
              {hasSearched && q && (
                <div className="mb-8">
                  <p className="font-sans text-lg text-muted-foreground mb-4">
                    {lang === 'en' 
                      ? `Showing ${products.length} results for:`
                      : `${products.length} resultaten weergeven voor:`
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary font-medium rounded-full">
                      <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                      "{q}"
                    </span>
                    <Link
                      href={`/${lang}/search`}
                      className="inline-flex items-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                      aria-label={lang === 'en' ? 'Clear search' : 'Zoekopdracht wissen'}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
              
              {!hasSearched && (
                <p className="font-sans text-lg text-muted-foreground mb-8">
                  {lang === 'en' 
                    ? 'Search through our collection of authentic cultural products'
                    : 'Zoek door onze collectie authentieke culturele producten'
                  }
                </p>
              )}
              
              {/* Search Input */}
              <div className="max-w-2xl mx-auto">
                <SearchInput 
                  currentLang={lang}
                  variant="hero"
                  autoFocus={!hasSearched}
                  placeholder={
                    lang === 'en' 
                      ? 'Search for products, categories...'
                      : 'Zoek naar producten, categorieën...'
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {hasSearched ? (
              products.length > 0 ? (
                <>
                  {/* Results Header */}
                  <div className="mb-12">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-2xl font-bold text-foreground">
                        {lang === 'en' ? 'Products' : 'Producten'} ({products.length})
                      </h2>
                      
                      {/* Sort/Filter Options - Placeholder for future enhancement */}
                      <div className="text-sm text-muted-foreground">
                        {lang === 'en' ? 'Sorted by relevance' : 'Gesorteerd op relevantie'}
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <ProductGrid
                    products={products}
                    currentLang={lang}
                    showCategory={true}
                  />
                </>
              ) : (
                /* No Results */
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MagnifyingGlassIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    {lang === 'en' ? 'No Results Found' : 'Geen Resultaten Gevonden'}
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {lang === 'en' 
                      ? `We couldn't find any products matching "${q}". Try different keywords or browse our categories.`
                      : `We konden geen producten vinden die overeenkomen met "${q}". Probeer andere zoekwoorden of bekijk onze categorieën.`
                    }
                  </p>
                  
                  {/* Suggestions */}
                  <div className="space-y-4">
                    <p className="font-semibold text-foreground">
                      {lang === 'en' ? 'Search Suggestions:' : 'Zoeksuggesties:'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['jewelry', 'textiles', 'crafts', 'art'].map((suggestion) => (
                        <Link
                          key={suggestion}
                          href={`/${lang}/search?q=${encodeURIComponent(
                            lang === 'en' 
                              ? suggestion 
                              : suggestion === 'jewelry' ? 'sieraden'
                                : suggestion === 'textiles' ? 'textiel'
                                : suggestion === 'crafts' ? 'ambacht'
                                : 'kunst'
                          )}`}
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-accent transition-colors text-sm"
                        >
                          {lang === 'en' 
                            ? suggestion.charAt(0).toUpperCase() + suggestion.slice(1)
                            : suggestion === 'jewelry' ? 'Sieraden'
                              : suggestion === 'textiles' ? 'Textiel'
                              : suggestion === 'crafts' ? 'Ambacht'
                              : 'Kunst'
                          }
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href={`/${lang}/categories`}
                      className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 transform shadow-lg"
                    >
                      <span>{lang === 'en' ? 'Browse All Categories' : 'Bekijk Alle Categorieën'}</span>
                    </Link>
                  </div>
                </div>
              )
            ) : (
              /* Search Welcome State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MagnifyingGlassIcon className="w-12 h-12 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  {lang === 'en' ? 'Discover Our Products' : 'Ontdek Onze Producten'}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {lang === 'en' 
                    ? 'Use the search bar above to find specific products, or browse our categories to discover cultural treasures.'
                    : 'Gebruik de zoekbalk hierboven om specifieke producten te vinden, of bekijk onze categorieën om culturele schatten te ontdekken.'
                  }
                </p>
                
                {/* Popular Searches */}
                <div className="space-y-4">
                  <p className="font-semibold text-foreground">
                    {lang === 'en' ? 'Popular Searches:' : 'Populaire Zoekopdrachten:'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(lang === 'en' 
                      ? ['Traditional jewelry', 'Handmade textiles', 'Cultural art', 'Heritage crafts']
                      : ['Traditionele sieraden', 'Handgemaakt textiel', 'Culturele kunst', 'Erfgoed ambacht']
                    ).map((term) => (
                      <Link
                        key={term}
                        href={`/${lang}/search?q=${encodeURIComponent(term)}`}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-accent transition-colors text-sm"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={`/${lang}/categories`}
                    className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 transform shadow-lg"
                  >
                    <span>{lang === 'en' ? 'Browse Categories' : 'Bekijk Categorieën'}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer currentLang={lang} />
      <WhatsAppButton currentLang={lang} />
    </>
  )
}