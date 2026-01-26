export type UserRole = "user" | "admin"
export type InvitationStatus = "draft" | "pending_payment" | "active" | "expired"
export type PaymentStatus = "pending" | "paid" | "expired" | "refunded"
export type AttendanceStatus = "hadir" | "tidak_hadir" | "belum_pasti"
export type TemplateCategory = "elegant" | "minimalist" | "traditional" | "modern" | "rustic" | "floral"

export interface Profile {
  id: string
  email: string
  provider: "email" | "google"
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  preview_url: string | null
  price: number
  category: TemplateCategory
  features: string[]
  is_active: boolean
  is_premium: boolean
  created_at: string
  updated_at: string
}

export interface BankAccount {
  bank: string
  account_number: string
  account_name: string
}

export interface Invitation {
  id: string
  user_id: string
  template_id: string | null
  slug: string

  // Couple Information
  groom_name: string
  groom_father: string | null
  groom_mother: string | null
  groom_photo_url: string | null
  bride_name: string
  bride_father: string | null
  bride_mother: string | null
  bride_photo_url: string | null
  couple_photo_url: string | null

  // Event Details
  akad_date: string | null
  akad_time: string | null
  akad_location: string | null
  akad_address: string | null
  akad_maps_url: string | null

  resepsi_date: string | null
  resepsi_time: string | null
  resepsi_location: string | null
  resepsi_address: string | null
  resepsi_maps_url: string | null

  // Additional Content
  love_story: string | null
  opening_text: string
  closing_text: string

  // Gallery & Music
  gallery_photos: string[]
  background_music_url: string | null

  // Settings
  show_countdown: boolean
  show_gallery: boolean
  show_love_story: boolean
  show_gift: boolean
  show_rsvp: boolean

  // Gift/Hadiah
  bank_accounts: BankAccount[]
  gift_address: string | null

  // Status
  status: InvitationStatus
  is_published: boolean
  view_count: number

  created_at: string
  updated_at: string

  // Relations
  template?: Template
}

export interface Guest {
  id: string
  invitation_id: string
  name: string
  phone: string | null
  email: string | null
  slug: string
  group_name: string | null
  invitation_sent: boolean
  invitation_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface RSVP {
  id: string
  invitation_id: string
  guest_id: string | null
  guest_name: string
  attendance: AttendanceStatus
  number_of_guests: number
  message: string | null
  created_at: string
}

export interface Wish {
  id: string
  invitation_id: string
  name: string
  message: string
  is_approved: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  invitation_id: string | null
  template_id: string | null
  order_number: string
  amount: number
  payment_status: PaymentStatus
  payment_proof_url: string | null
  payment_date: string | null
  payment_verified_at: string | null
  payment_verified_by: string | null
  payment_notes: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_account_name: string | null
  transfer_amount: number | null
  expires_at: string | null
  created_at: string
  updated_at: string

  // Relations
  invitation?: Invitation
  template?: Template
  user?: Profile
}

export interface Setting {
  id: string
  key: string
  value: Record<string, unknown>
  created_at: string
  updated_at: string
}
