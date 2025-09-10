import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Homepage Content',
      readOnly: true,
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'backgroundImage',
              title: 'Background Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
              ],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'heading',
              title: 'Heading',
              type: 'translatable',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'bodyText',
              title: 'Body Text',
              type: 'translatable',
            },
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'translatable',
            },
            {
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
              description: 'Internal link like /products or /about',
            },
          ],
          preview: {
            select: {
              title: 'heading.en',
              media: 'backgroundImage',
            },
            prepare({ title, media }) {
              return {
                title: title || 'Untitled Slide',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'welcomeHeading',
      title: 'Welcome Heading',
      type: 'translatable',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'welcomeBody',
      title: 'Welcome Body',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'block' }],
        },
        {
          name: 'nl',
          title: 'Dutch',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    }),
    defineField({
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Icon identifier (e.g., shield, award, heart)',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'text',
              title: 'Badge Text',
              type: 'translatable',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Badge Description',
              type: 'translatable',
              description: 'Optional detailed description for the badge',
            },
          ],
          preview: {
            select: {
              title: 'text.en',
              subtitle: 'icon',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled Badge',
                subtitle: subtitle ? `Icon: ${subtitle}` : undefined,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'storeSection',
      title: 'Store Section',
      type: 'object',
      fields: [
        {
          name: 'storeImage',
          title: 'Store Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
        {
          name: 'address',
          title: 'Store Address',
          type: 'translatable',
          description: 'Store address - use line breaks for multiple lines (street, city, postal code, etc.)',
        },
        {
          name: 'timings',
          title: 'Store Timings',
          type: 'translatable',
          description: 'Opening hours - use line breaks for different days or time periods',
        },
        {
          name: 'contactInfo',
          title: 'Contact Information',
          type: 'translatable',
          description: 'Contact details - use line breaks for multiple phone numbers, emails, etc.',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'translatable',
          description: 'Title for search engines (50-60 characters)',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'translatable',
          description: 'Description for search engines (150-160 characters)',
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Content',
      }
    },
  },
})