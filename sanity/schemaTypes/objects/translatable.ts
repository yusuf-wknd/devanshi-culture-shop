import { defineType } from 'sanity'

export const translatable = defineType({
  name: 'translatable',
  title: 'Translatable Text',
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 3,
    },
    {
      name: 'nl',
      title: 'Dutch',
      type: 'text',
      rows: 3,
    },
  ],
  preview: {
    select: {
      en: 'en',
      nl: 'nl',
    },
    prepare({ en, nl }) {
      return {
        title: en || nl || 'No content',
        subtitle: nl && en !== nl ? nl : undefined,
      }
    },
  },
})