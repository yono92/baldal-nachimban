export type Category =
  | "autism"
  | "adhd"
  | "language"
  | "social"
  | "sensory"
  | "age_development";

export type GuideType = "observation" | "action" | "age_guide";

export interface Topic {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  category: Category;
  min_age_months: number | null;
  max_age_months: number | null;
  published: boolean;
  created_at: string;
}

export interface Paper {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  key_points: string[] | null;
  limitations: string | null;
  parent_interpretation: string | null;
  year: number | null;
  journal: string | null;
  source_url: string | null;
  category: Category | null;
  published: boolean;
  created_at: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  type: GuideType;
  min_age_months: number | null;
  max_age_months: number | null;
  published: boolean;
  created_at: string;
}

export interface Database {
  nachimban: {
    Tables: {
      topics: { Row: Topic; Insert: Omit<Topic, "id" | "created_at">; Update: Partial<Omit<Topic, "id">> };
      papers: { Row: Paper; Insert: Omit<Paper, "id" | "created_at">; Update: Partial<Omit<Paper, "id">> };
      guides: { Row: Guide; Insert: Omit<Guide, "id" | "created_at">; Update: Partial<Omit<Guide, "id">> };
      topic_papers: { Row: { topic_id: string; paper_id: string } };
      topic_guides: { Row: { topic_id: string; guide_id: string } };
    };
  };
}
