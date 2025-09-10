import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'nl']
const defaultLocale = 'en'

// Get the preferred locale based on Accept-Language header or default
function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // If pathname already has a locale, extract it
  if (!pathnameIsMissingLocale) {
    return pathname.split('/')[1]
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Parse the Accept-Language header and find the best match
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale, q = '1'] = lang.trim().split(';q=')
        return { locale: locale.toLowerCase(), quality: parseFloat(q) }
      })
      .sort((a, b) => b.quality - a.quality)

    for (const { locale } of languages) {
      // Check for exact match
      if (locales.includes(locale)) {
        return locale
      }
      // Check for language match (e.g., 'en-US' -> 'en')
      const languageCode = locale.split('-')[0]
      if (locales.includes(languageCode)) {
        return languageCode
      }
      // Special case for Dutch variants
      if (locale.startsWith('nl')) {
        return 'nl'
      }
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files, API routes, and Sanity studio
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    // Handle root path
    if (pathname === '/') {
      return NextResponse.redirect(
        new URL(`/${locale}`, request.url)
      )
    }
    
    // Handle other paths
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }

  // Add locale to response headers for use in components
  const response = NextResponse.next()
  const currentLocale = pathname.split('/')[1]
  response.headers.set('x-locale', currentLocale)
  
  return response
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|studio|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}