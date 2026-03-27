import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://baldal-nachimban.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/topics`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/papers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/glossary`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/checklist`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/consultation`, changeFrequency: "monthly", priority: 0.8 },
  ];

  // 동적 페이지
  const [topics, papers, guides] = await Promise.all([
    supabase.from("topics").select("slug, created_at").eq("published", true),
    supabase.from("papers").select("slug, created_at").eq("published", true),
    supabase.from("guides").select("slug, created_at").eq("published", true),
  ]);

  const topicPages: MetadataRoute.Sitemap = (topics.data ?? []).map((t) => ({
    url: `${BASE_URL}/topics/${t.slug}`,
    lastModified: t.created_at,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const paperPages: MetadataRoute.Sitemap = (papers.data ?? []).map((p) => ({
    url: `${BASE_URL}/papers/${p.slug}`,
    lastModified: p.created_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = (guides.data ?? []).map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: g.created_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...topicPages, ...paperPages, ...guidePages];
}
