export interface Creator {
  id: string;
  name: string;
  platform: "Instagram" | "YouTube" | "Twitter";
  primary_niche: string;
  secondary_niche: string | null;
  followers: number;
  engagement_rate: number;
  avg_views: number;
  contact_email: string | null;
  contact_phone: string | null;
  city: string;
  language: string;
  cost_per_post: number;
  tags: string[];
  profile_score: number;
  missing_fields: string[];
}

export type CreatorStatus = "shortlisted" | "backup" | "rejected" | "pending";

export interface Campaign {
  id: string;
  code: string;
  name: string;
  niches: string[];
  goal?: string;
  startDate?: string;
}

export interface FilterState {
  platforms: string[];
  niches: string[];
  minFollowers: number;
  maxCost: number;
  language: string;
  city: string;
  aiPicksOnly: boolean;
}
