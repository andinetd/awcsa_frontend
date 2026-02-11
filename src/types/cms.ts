export type CMSContentType =
  | "HERO"
  | "TESTIMONIAL"
  | "GALLERY"
  | "SERVICE"
  | "SOCIAL"
  | "QUICK_LINK"
  | "CONTACT";

export interface CMSContent {
  id?: number;
  type: CMSContentType;
  title?: string;
  subtitle?: string;
  content?: string;
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
}
