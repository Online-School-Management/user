import type { MetadataRoute } from "next";
import { APP_BASE_URL } from "@/constants";
import { getAllCourses } from "@/services/courseService";

const locales = ["en", "my"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getAllCourses();
  const now = new Date().toISOString();

  const staticPages = [
    "",
    "courses",
    "articles",
    "login",
    "privacy",
    "terms",
    "contact",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      const path = page ? `/${locale}/${page}` : `/${locale}`;
      entries.push({
        url: `${APP_BASE_URL}${path}`,
        lastModified: now,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.7,
      });
    }

    for (const course of courses) {
      entries.push({
        url: `${APP_BASE_URL}/${locale}/courses/${course.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
