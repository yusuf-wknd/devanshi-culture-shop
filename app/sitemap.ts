import { MetadataRoute } from "next";
import { getAllCategories, getAllProducts } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://devanshicultureshop.nl"; // Replace with your actual domain
  const languages = ["en", "nl"];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [];

  // Homepage for both languages
  languages.forEach((lang) => {
    staticPages.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    // Categories listing page
    staticPages.push({
      url: `${baseUrl}/${lang}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Search page
    staticPages.push({
      url: `${baseUrl}/${lang}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  try {
    // Fetch categories and products
    const [categories, products] = await Promise.all([
      getAllCategories().catch(() => []),
      getAllProducts().catch(() => []),
    ]);

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = [];
    categories.forEach((category: any) => {
      languages.forEach((lang) => {
        categoryPages.push({
          url: `${baseUrl}/${lang}/categories/${category.slug.current}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    });

    // Product pages
    const productPages: MetadataRoute.Sitemap = [];
    products.forEach((product: any) => {
      languages.forEach((lang) => {
        productPages.push({
          url: `${baseUrl}/${lang}/products/${product.slug.current}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.9,
        });
      });
    });

    return [...staticPages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least the static pages if dynamic content fails
    return staticPages;
  }
}
