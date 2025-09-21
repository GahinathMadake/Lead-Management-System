export type LeadSource = "website" | "facebook_ads" | "google_ads" | "referral" | "events" | "other";
export type LeadStatus = "new" | "contacted" | "qualified" | "lost" | "won";

export const LeadSources: LeadSource[] = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
export const LeadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "lost", "won"];

export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  city?: string;
  state?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  lead_value: number;
  last_activity_at?: string | null;
  is_qualified: boolean;
  created_at: string;
  updated_at: string;
  userId: number;
}
