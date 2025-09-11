import { client } from './client'
import { groq } from 'next-sanity'

// Base query for translatable content
const translatableContent = `
  "en": en,
  "nl": nl
`

// Homepage queries
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    _id,
    _type,
    title,
    heroSlides[] {
      backgroundImage {
        asset->,
        alt
      },
      mobileImage {
        asset->,
        alt
      },
      heading {
        ${translatableContent}
      },
      bodyText {
        ${translatableContent}
      },
      buttonText {
        ${translatableContent}
      },
      buttonLink
    },
    welcomeHeading {
      ${translatableContent}
    },
    welcomeBody {
      ${translatableContent}
    },
    trustBadges[] {
      icon,
      text {
        ${translatableContent}
      },
      description {
        ${translatableContent}
      }
    },
    storeSection {
      storeImage {
        asset->,
        alt
      },
      address,
      timings,
      contactInfo
    },
    seo {
      metaTitle {
        ${translatableContent}
      },
      metaDescription {
        ${translatableContent}
      }
    }
  }
`

// About page query
export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    _id,
    _type,
    title,
    heading {
      ${translatableContent}
    },
    introduction {
      ${translatableContent}
    },
    heroImage {
      asset->,
      alt
    },
    storyHeading {
      ${translatableContent}
    },
    storyContent {
      ${translatableContent}
    },
    valuesHeading {
      ${translatableContent}
    },
    valuesSubheading {
      ${translatableContent}
    },
    valuesList[] {
      valueTitle {
        ${translatableContent}
      },
      valueDescription {
        ${translatableContent}
      }
    },
    impactHeading {
      ${translatableContent}
    },
    impactSubheading {
      ${translatableContent}
    },
    impactList[] {
      impactStatistic,
      impactLabel {
        ${translatableContent}
      }
    },
    offerHeading {
      ${translatableContent}
    },
    offerImage {
      asset->,
      alt
    },
    offerList[] {
      ${translatableContent}
    },
    visitHeading {
      ${translatableContent}
    },
    visitText {
      ${translatableContent}
    },
    seo {
      metaTitle {
        ${translatableContent}
      },
      metaDescription {
        ${translatableContent}
      }
    }
  }
`

// Category queries
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(categoryName.en asc) {
    _id,
    categoryName {
      ${translatableContent}
    },
    slug,
    description {
      ${translatableContent}
    },
    categoryImage {
      asset->,
      alt
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    categoryName {
      ${translatableContent}
    },
    slug,
    description {
      ${translatableContent}
    },
    categoryImage {
      asset->,
      alt
    },
    seo {
      metaTitle {
        ${translatableContent}
      },
      metaDescription {
        ${translatableContent}
      }
    }
  }
`

export const categoryStaticParamsQuery = groq`
  *[_type == "category"] {
    "slug": slug.current
  }
`

// Product queries
export const allProductsQuery = groq`
  *[_type == "product"] | order(itemNumber asc) {
    _id,
    productName {
      ${translatableContent}
    },
    slug,
    productImages[] {
      asset->,
      alt
    },
    description {
      ${translatableContent}
    },
    category-> {
      categoryName {
        ${translatableContent}
      },
      slug
    },
    itemNumber,
    price,
    isAvailable
  }
`

export const productsByCategory = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(itemNumber asc) {
    _id,
    productName {
      ${translatableContent}
    },
    slug,
    productImages[] {
      asset->,
      alt
    },
    description {
      ${translatableContent}
    },
    category-> {
      categoryName {
        ${translatableContent}
      },
      slug
    },
    itemNumber,
    price,
    isAvailable
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    productName {
      ${translatableContent}
    },
    slug,
    productImages[] {
      asset->,
      alt
    },
    description {
      ${translatableContent}
    },
    category-> {
      categoryName {
        ${translatableContent}
      },
      slug
    },
    itemNumber,
    price,
    isAvailable,
    seo {
      metaTitle {
        ${translatableContent}
      },
      metaDescription {
        ${translatableContent}
      }
    }
  }
`

export const productStaticParamsQuery = groq`
  *[_type == "product"] {
    "slug": slug.current,
    "category": category->slug.current
  }
`

// Search query
export const searchProductsQuery = groq`
  *[_type == "product" && (
    productName.en match $searchTerm + "*" ||
    productName.nl match $searchTerm + "*" ||
    description.en match $searchTerm + "*" ||
    description.nl match $searchTerm + "*"
  )] | order(itemNumber asc) {
    _id,
    productName {
      ${translatableContent}
    },
    slug,
    productImages[] {
      asset->,
      alt
    },
    description {
      ${translatableContent}
    },
    category-> {
      categoryName {
        ${translatableContent}
      },
      slug
    },
    itemNumber,
    price,
    isAvailable
  }
`

// Store Settings query
export const storeSettingsQuery = groq`
  *[_type == "storeSettings"][0] {
    _id,
    _type,
    title,
    address {
      ${translatableContent}
    },
    timings {
      ${translatableContent}
    },
    phoneMain,
    phoneSecondary,
    email,
    storeImage {
      asset->,
      alt
    }
  }
`

// Fetch functions
export async function getHomePage() {
  return await client.fetch(homePageQuery)
}

export async function getAboutPage() {
  return await client.fetch(aboutPageQuery)
}

export async function getStoreSettings() {
  return await client.fetch(storeSettingsQuery)
}

export async function getAllCategories() {
  return await client.fetch(allCategoriesQuery)
}

export async function getCategoryBySlug(slug: string) {
  return await client.fetch(categoryBySlugQuery, { slug })
}

export async function getCategoryStaticParams() {
  return await client.fetch(categoryStaticParamsQuery)
}

export async function getAllProducts() {
  return await client.fetch(allProductsQuery)
}

export async function getProductsByCategory(categorySlug: string) {
  return await client.fetch(productsByCategory, { categorySlug })
}

export async function getProductBySlug(slug: string) {
  return await client.fetch(productBySlugQuery, { slug })
}

export async function getProductStaticParams() {
  return await client.fetch(productStaticParamsQuery)
}

export async function searchProducts(searchTerm: string) {
  return await client.fetch(searchProductsQuery, { searchTerm })
}

// Types for better TypeScript support
export interface TranslatableText {
  en: string
  nl: string
}

export interface TranslatableRichText {
  en: any[]
  nl: any[]
}

export interface SanityImage {
  asset: {
    _id: string
    url: string
  }
  alt: string
}

export interface HeroSlide {
  backgroundImage: SanityImage
  mobileImage?: SanityImage
  heading: TranslatableText
  bodyText: TranslatableText
  buttonText: TranslatableText
  buttonLink: string
}

export interface TrustBadge {
  icon: string
  text: TranslatableText
  description?: TranslatableText
}

export interface StoreSection {
  storeImage: SanityImage
  address: string
  timings: string
  contactInfo: string
}

export interface SEO {
  metaTitle: TranslatableText
  metaDescription: TranslatableText
}

export interface HomePage {
  _id: string
  _type: string
  title: string
  heroSlides: HeroSlide[]
  welcomeHeading: TranslatableText
  welcomeBody: TranslatableRichText
  trustBadges: TrustBadge[]
  storeSection: StoreSection
  seo: SEO
}

export interface Category {
  _id: string
  categoryName: TranslatableText
  slug: {
    current: string
  }
  description?: TranslatableText
  categoryImage?: SanityImage
  productCount?: number
  seo?: SEO
}

export interface Product {
  _id: string
  productName: TranslatableText
  slug: {
    current: string
  }
  productImages: SanityImage[]
  description?: TranslatableText
  category?: {
    categoryName: TranslatableText
    slug: {
      current: string
    }
  }
  itemNumber: string
  price: number
  isAvailable?: boolean
  seo?: SEO
}

export interface AboutPageValue {
  valueTitle: TranslatableText
  valueDescription: TranslatableText
}

export interface AboutPageImpact {
  impactStatistic: string
  impactLabel: TranslatableText
}

export interface AboutPage {
  _id: string
  _type: string
  title: string
  heading: TranslatableText
  introduction: TranslatableText
  heroImage?: SanityImage
  storyHeading: TranslatableText
  storyContent: TranslatableRichText
  valuesHeading: TranslatableText
  valuesSubheading: TranslatableText
  valuesList: AboutPageValue[]
  impactHeading: TranslatableText
  impactSubheading: TranslatableText
  impactList: AboutPageImpact[]
  offerHeading: TranslatableText
  offerImage?: SanityImage
  offerList: TranslatableText[]
  visitHeading: TranslatableText
  visitText: TranslatableText
  seo: SEO
}

export interface StoreSettings {
  _id: string
  _type: string
  title: string
  address: TranslatableText
  timings: TranslatableText
  phoneMain: string
  phoneSecondary?: string
  email: string
  storeImage?: SanityImage
}