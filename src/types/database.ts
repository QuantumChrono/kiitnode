// Types derived from schema.sql — keep in sync manually.
// If the schema changes, update these types to match.

// ─── Enum / union types ───────────────────────────────────────────────────────

export type PostTag = "MARKET" | "COLLAB" | "REQUEST" | "DISCUSSION";

export type ResourceCategory = "APP" | "WEBSITE" | "TOOL" | "NOTES";

export type ReportCategory = "SPAM" | "INAPPROPRIATE" | "THREAT_SAFETY";

export type ReportStatus = "pending" | "reviewed" | "dismissed";

export type SeriousnessLevel =
  | "Chill / Hobby"
  | "Serious Project"
  | "Hackathon Pod"
  | "Startup MVP";

export type WeeklyBandwidth =
  | "< 5 hrs/week"
  | "5-15 hrs/week"
  | "20+ hrs/week";

// ─── Row types ────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  whatsapp_number: string | null;
  campus_location: string | null;
  is_moderator: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tag: PostTag;
  skill_tags: string[] | null;
  seriousness_level: string | null;
  weekly_bandwidth: string | null;
  location_tag: string | null;
  is_anonymous: boolean;
  sponsored: boolean;
  sponsor_name: string | null;
  moderation_score: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
}

/** Matches the posts_public view — identity fields are null when is_anonymous = true */
export interface PublicPost {
  id: string;
  user_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  whatsapp_number: string | null;
  title: string;
  content: string;
  tag: PostTag;
  skill_tags: string[] | null;
  seriousness_level: string | null;
  weekly_bandwidth: string | null;
  location_tag: string | null;
  is_anonymous: boolean;
  sponsored: boolean;
  sponsor_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Resource {
  id: string;
  submitted_by: string;
  title: string;
  url: string;
  description: string;
  category: ResourceCategory;
  upvotes_count: number;
  created_at: string;
}

export interface ResourceUpvote {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  category: ReportCategory;
  status: ReportStatus;
  created_at: string;
}

export interface Block {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

// ─── Supabase client generic ──────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at" | "is_moderator">; Update: Partial<Profile> };
      posts: { Row: Post; Insert: Omit<Post, "id" | "created_at" | "is_active" | "sponsored" | "moderation_score">; Update: Partial<Post> };
      resources: { Row: Resource; Insert: Omit<Resource, "id" | "created_at" | "upvotes_count">; Update: Partial<Resource> };
      resource_upvotes: { Row: ResourceUpvote; Insert: Omit<ResourceUpvote, "id" | "created_at">; Update: never };
      reports: { Row: Report; Insert: Omit<Report, "id" | "created_at" | "status">; Update: Partial<Pick<Report, "status">> };
      blocks: { Row: Block; Insert: Omit<Block, "created_at">; Update: never };
    };
    Views: {
      posts_public: { Row: PublicPost };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
