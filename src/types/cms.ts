export type CMSContentType =
  | "HERO"
  | "TESTIMONIAL"
  | "GALLERY_IMAGE"
  | "SERVICE"
  | "SOCIAL_LINK"
  | "QUICK_LINK"
  | "PARTNER_LOGO"
  | "CONTACT";

export interface LocalizedField {
  en: string;
  am: string;
}

export interface CMSContent {
  id?: number;
  type: CMSContentType;
  title?: LocalizedField;
  subtitle?: LocalizedField;
  content?: LocalizedField;
  imageUrl?: string;
  isVisible: boolean;
  order: number;
  metadata?: Record<string, any>;
}

export interface CMSSettings {
  key: string;
  value: any;
}

export interface LandingPageData {
  hero: any;
  contact: any;
  gallery: CMSContent[];
  testimonials: CMSContent[];
  social: CMSContent[];
  quickLinks: CMSContent[];
  services?: CMSContent[]; // Added based on ServicesSection existence
  partners?: CMSContent[];
}
