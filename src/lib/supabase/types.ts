export type Category =
  | "autism"
  | "adhd"
  | "language"
  | "social"
  | "sensory"
  | "age_development";

export type GuideType = "observation" | "action" | "age_guide" | "activity";

export type EvidenceLevel =
  | "systematic_review"
  | "randomized_trial"
  | "cohort"
  | "case_control"
  | "cross_sectional"
  | "expert_opinion"
  | "other";

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
  doi: string | null;
  evidence_level: EvidenceLevel | null;
  reviewed_at: string | null;
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
  materials: string | null;
  duration_minutes: number | null;
  difficulty: string | null;
  published: boolean;
  created_at: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
  published: boolean;
  created_at: string;
}

export type ContentType = "topic" | "paper" | "guide" | "glossary";

export interface Bookmark {
  id: string;
  user_id: string;
  content_type: ContentType;
  content_id: string;
  created_at: string;
}

export interface ConsultationHistory {
  id: string;
  user_id: string;
  child_birth_date: string;
  child_gender: "male" | "female";
  age_in_months: number;
  selected_symptoms: string[] | null;
  free_text: string | null;
  result: unknown;
  created_at: string;
}

export interface SearchResult {
  content_type: ContentType;
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: Category | string | null;
  guide_type: GuideType | null;
  rank: number;
}

export interface Database {
  nachimban: {
    Tables: {
      topics: { Row: Topic; Insert: Omit<Topic, "id" | "created_at">; Update: Partial<Omit<Topic, "id">> };
      papers: { Row: Paper; Insert: Omit<Paper, "id" | "created_at">; Update: Partial<Omit<Paper, "id">> };
      guides: { Row: Guide; Insert: Omit<Guide, "id" | "created_at">; Update: Partial<Omit<Guide, "id">> };
      topic_papers: { Row: { topic_id: string; paper_id: string } };
      topic_guides: { Row: { topic_id: string; guide_id: string } };
      glossary_terms: { Row: GlossaryTerm; Insert: Omit<GlossaryTerm, "id" | "created_at">; Update: Partial<Omit<GlossaryTerm, "id">> };
      bookmarks: { Row: Bookmark; Insert: Omit<Bookmark, "id" | "created_at">; Update: Partial<Omit<Bookmark, "id">> };
      consultation_histories: { Row: ConsultationHistory; Insert: Omit<ConsultationHistory, "id" | "created_at">; Update: Partial<Omit<ConsultationHistory, "id">> };
    };
  };
}
