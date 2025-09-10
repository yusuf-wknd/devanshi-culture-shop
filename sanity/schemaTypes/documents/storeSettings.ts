import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'storeSettings',
  title: 'Store Settings',
  type: 'document',
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Store Settings',
      readOnly: true,
      description: 'This is a singleton document for store information',
    }),
    defineField({
      name: 'address',
      title: 'Store Address',
      type: 'translatable',
      description: 'Complete store address - use line breaks for multiple lines (street, city, postal code, etc.)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timings',
      title: 'Opening Hours',
      type: 'translatable',
      description: 'Store opening hours - use line breaks for different days or time periods',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phoneMain',
      title: 'Main Phone Number',
      type: 'string',
      description: 'Primary contact phone number (will be used for WhatsApp and tel: links)',
      validation: (Rule) => Rule.required().regex(/^\+?[\d\s-()]+$/, {
        name: 'phone',
        invert: false
      }).error('Please enter a valid phone number'),
    }),
    defineField({
      name: 'phoneSecondary',
      title: 'Secondary Phone Number',
      type: 'string',
      description: 'Optional secondary contact phone number',
      validation: (Rule) => Rule.regex(/^\+?[\d\s-()]+$/, {
        name: 'phone',
        invert: false
      }).error('Please enter a valid phone number'),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Main contact email address (will be used for mailto: links)',
      validation: (Rule) => Rule.required().email().error('Please enter a valid email address'),
    }),
    defineField({
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
      description: 'Optional image of the store interior/exterior',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Store Settings',
        subtitle: 'Store information and contact details',
      }
    },
  },
})