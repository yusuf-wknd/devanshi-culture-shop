import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton documents
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homepage')
            .title('Homepage Content')
        ),
      S.listItem()
        .title('About Page')
        .id('aboutpage')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutpage')
            .title('About Page Content')
        ),
      S.divider(),
      
      // Regular documents
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('category').title('Categories'),
      
      S.divider(),
      
      // Hide singleton types from the regular document list
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['homePage', 'aboutPage', 'product', 'category'].includes(item.getId()!),
      ),
    ])
