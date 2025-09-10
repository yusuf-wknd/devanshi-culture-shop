import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About Page Content',
      readOnly: true,
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'translatable',
      description: 'e.g., "About Devanshi Culture Shop"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'translatable',
      description: 'Opening paragraph introducing the shop',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Background image for the hero section',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'storyHeading',
      title: 'Story Section Heading',
      type: 'translatable',
      description: 'e.g., "Our Story"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'storyContent',
      title: 'Story Content',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'valuesHeading',
      title: 'Values Section Heading',
      type: 'translatable',
      description: 'e.g., "Our Values"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'valuesSubheading',
      title: 'Values Subheading',
      type: 'translatable',
      description: 'Description of principles/values',
    }),
    defineField({
      name: 'valuesList',
      title: 'Values List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'valueTitle',
              title: 'Value Title',
              type: 'translatable',
              description: 'e.g., "Authentic Heritage"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'valueDescription',
              title: 'Value Description',
              type: 'translatable',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'valueTitle.en',
              subtitle: 'valueDescription.en',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled Value',
                subtitle: subtitle ? `${subtitle.substring(0, 60)}...` : undefined,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'impactHeading',
      title: 'Impact Section Heading',
      type: 'translatable',
      description: 'e.g., "Our Impact"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'impactSubheading',
      title: 'Impact Subheading',
      type: 'translatable',
      description: 'Description of impact/numbers',
    }),
    defineField({
      name: 'impactList',
      title: 'Impact Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'impactStatistic',
              title: 'Statistic',
              type: 'string',
              description: 'e.g., "500+"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'impactLabel',
              title: 'Label',
              type: 'translatable',
              description: 'e.g., "Happy Customers"',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'impactStatistic',
              subtitle: 'impactLabel.en',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'No statistic',
                subtitle: subtitle || 'No label',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'offerHeading',
      title: 'What We Offer Heading',
      type: 'translatable',
      description: 'e.g., "What We Offer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'offerImage',
      title: 'What We Offer Background Image',
      type: 'image',
      description: 'Background image for the What We Offer section',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'offerList',
      title: 'Offer List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'nl',
              title: 'Dutch',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'en',
              subtitle: 'nl',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled offer',
                subtitle: subtitle && subtitle !== title ? subtitle : undefined,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'visitHeading',
      title: 'Visit Us Heading',
      type: 'translatable',
      description: 'e.g., "Visit Us Today"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visitText',
      title: 'Visit Us Text',
      type: 'translatable',
      description: 'Final paragraph encouraging visits',
      validation: (Rule) => Rule.required(),
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
        title: 'About Page Content',
      }
    },
  },
})