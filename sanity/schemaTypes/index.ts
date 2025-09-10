import { type SchemaTypeDefinition } from 'sanity'

// Objects
import { translatable } from './objects/translatable'

// Documents
import { product } from './documents/product'
import { category } from './documents/category'
import { homePage } from './documents/homePage'
import { aboutPage } from './documents/aboutPage'
import storeSettings from './documents/storeSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects
    translatable,
    
    // Documents
    product,
    category,
    homePage,
    aboutPage,
    storeSettings,
  ],
}
