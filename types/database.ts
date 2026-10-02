export type UserRole = "user" | "admin";
export type InvitationStatus = "draft" | "published" | "unpublished";
export type RSVPStatus = "pending" | "attending" | "not_attending";
export type WishVisibility = "visible" | "hidden";
export type PaymentStatus = "pending" | "paid" | "expired" | "refunded";
export type ThemeCategory = "elegant" | "minimalist" | "traditional" | "modern" | "rustic" | "floral";

export interface Profile {
  id: string;
  email: string;
  provider: "email" | "google";
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  preview_url: string | null;
  price: number;
  category: ThemeCategory;
  features: string[];
  is_active: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeSection {
  id: string;
  theme_id: string;
  section_key: string;
  section_type: string;
  position: number;
  default_content: Record<string, unknown>;
  is_required: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  bank: string;
  account_number: string;
  account_name: string;
}

export interface Invitation {
  id: string;
  user_id: string;
  theme_id: string | null;
  slug: string;
  groom_name: string;
  groom_father: string | null;
  groom_mother: string | null;
  groom_photo_url: string | null;
  bride_name: string;
  bride_father: string | null;
  bride_mother: string | null;
  bride_photo_url: string | null;
  couple_photo_url: string | null;
  akad_date: string | null;
  akad_time: string | null;
  akad_location: string | null;
  akad_address: string | null;
  akad_maps_url: string | null;
  resepsi_date: string | null;
  resepsi_time: string | null;
  resepsi_location: string | null;
  resepsi_address: string | null;
  resepsi_maps_url: string | null;
  love_story: string | null;
  opening_text: string;
  closing_text: string;
  gallery_photos: string[];
  background_music_url: string | null;
  show_countdown: boolean;
  show_gallery: boolean;
  show_love_story: boolean;
  show_gift: boolean;
  show_rsvp: boolean;
  bank_accounts: BankAccount[];
  gift_address: string | null;
  status: InvitationStatus;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  theme?: Theme;
}

export interface InvitationSection {
  id: string;
  invitation_id: string;
  section_key: string;
  section_type: string;
  position: number;
  content: Record<string, unknown>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  group_name: string | null;
  public_token: string;
  created_at: string;
  updated_at: string;
}

export interface RSVP {
  id: string;
  invitation_id: string;
  guest_id: string;
  status: RSVPStatus;
  attendee_count: number;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wish {
  id: string;
  invitation_id: string;
  guest_id: string | null;
  guest_name: string;
  message: string;
  visibility: WishVisibility;
  created_at: string;
  updated_at: string;
}

export interface InvitationMedia {
  id: string;
  invitation_id: string;
  storage_path: string;
  file_name: string;
  mime_type: "image/jpeg" | "image/png" | "image/webp";
  file_size_bytes: number;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  invitation_id: string | null;
  theme_id: string | null;
  order_number: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_proof_url: string | null;
  payment_date: string | null;
  payment_verified_at: string | null;
  payment_verified_by: string | null;
  payment_notes: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  transfer_amount: number | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  invitation?: Invitation;
  theme?: Theme;
  user?: Profile;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
