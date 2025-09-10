import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "itemNumber",
      title: "Item Number",
      type: "string",
      description:
        "Internal product identifier (e.g., ABC001). Used for storing & sorting but not displayed to customers.",
      validation: (Rule) =>
        Rule.required()
          .regex(/^[A-Z0-9]+$/, {
            name: "itemNumber",
            invert: false,
          })
          .error(
            "Item number should only contain uppercase letters and numbers"
          ),
    }),
    defineField({
      name: "productName",
      title: "Product Name",
      type: "translatable",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (EUR)",
      type: "number",
      description: "Product price in euros",
      validation: (Rule) =>
        Rule.required().min(0).error("Price must be a positive number"),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL slug for the product page",
      options: {
        source: "productName.en",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productImages",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Important for SEO and accessibility",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "translatable",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "isAvailable",
      title: "Available for Pickup",
      type: "boolean",
      description:
        'Check if this product is available for in-store pickup. Unchecked products will show as "Currently Not Available".',
      initialValue: true,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "translatable",
          description: "Title for search engines (50-60 characters)",
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "translatable",
          description: "Description for search engines (150-160 characters)",
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "productName.en",
      subtitle: "category.categoryName.en",
      media: "productImages.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Product",
        subtitle: subtitle || "No category",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Product Name (A-Z)",
      name: "productNameAsc",
      by: [{ field: "productName.en", direction: "asc" }],
    },
    {
      title: "Product Name (Z-A)",
      name: "productNameDesc",
      by: [{ field: "productName.en", direction: "desc" }],
    },
    {
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category.categoryName.en", direction: "asc" }],
    },
  ],
});
