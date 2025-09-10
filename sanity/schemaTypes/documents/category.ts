import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'categoryName',
      title: 'Category Name',
      type: 'translatable',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL slug for the category page',
      options: {
        source: 'categoryName.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'translatable',
      description: 'Optional description for the category',
    }),
    defineField({
      name: 'categoryImage',
      title: 'Category Image',
      type: 'image',
      description: 'Image to represent this category',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'categoryName.en',
      subtitle: 'categoryName.nl',
      media: 'categoryImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Category',
        subtitle: subtitle && subtitle !== title ? subtitle : undefined,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Category Name (A-Z)',
      name: 'categoryNameAsc',
      by: [{ field: 'categoryName.en', direction: 'asc' }],
    },
    {
      title: 'Category Name (Z-A)',
      name: 'categoryNameDesc',
      by: [{ field: 'categoryName.en', direction: 'desc' }],
    },
  ],
})