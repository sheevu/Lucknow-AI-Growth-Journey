import type { BlogArticle } from "./blogs";
export type BlogArticleSummary = Pick<BlogArticle, "id" | "title" | "metaDescription" | "primaryKeyword" | "slug" | "category" | "date" | "status" | "indexable" | "readingMinutes" | "coverAlt"> & {
  excerpt: string;
  categoryName: string;
  image: string;
};
export function formatArticleDate(date: string | null) {
  return date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)) : "Draft";
}
