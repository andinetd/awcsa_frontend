import {
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Info,
  ExternalLink,
} from "lucide-react";
import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CMSContent } from "@/types/cms";

interface FooterProps {
  socialLinks?: CMSContent[];
  quickLinks?: CMSContent[];
  contactInfo?: CMSContent[];
}

const iconMap: Record<string, any> = {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Youtube,
  Globe,
  Info,
};

const Footer = ({ socialLinks, quickLinks, contactInfo }: FooterProps) => {
  const t = useTranslations("footer");
  const locale = useLocale() as "en" | "am";

  const defaultQuickLinks = [
    { name: t("home"), href: "/" },
    { name: t("services"), href: "#services" },
    { name: t("feedback"), href: "#feedback" },
    { name: t("products"), href: "/products" },
    { name: t("login"), href: "/login" },
  ];

  const defaultContactInfo = [
    { icon: MapPin, text: t("address") },
    { icon: Phone, text: t("phone") },
    { icon: Mail, text: t("email") },
  ];

  const defaultSocialLinks = [
    { icon: Facebook, href: "https://web.facebook.com/AABWCS" },
    {
      icon: Twitter,
      href: "https://x.com/bowcsa?t=2VCCz3kWshrTsLQrKnO_Fw&s=35",
    },
    { icon: Linkedin, href: "#" },
  ];

  const renderQuickLinks =
    quickLinks && quickLinks.length > 0
      ? quickLinks
          .filter((i) => i.isVisible)
          .map((item) => ({
            name: item.title?.[locale] || "",
            href: item.metadata?.link || "#",
          }))
      : defaultQuickLinks;

  const renderContactInfo = React.useMemo(() => {
    // If contactInfo is a single object (CONTACT_INFO pattern)
    if (contactInfo && !Array.isArray(contactInfo)) {
      const data = contactInfo as any;
      return [
        {
          icon: MapPin,
          text:
            data.address?.[locale] ||
            data.address_en ||
            data.address_am ||
            t("address"),
        },
        { icon: Phone, text: data.phone || t("phone") },
        { icon: Mail, text: data.email || t("email") },
      ];
    }

    // If contactInfo is a list (TESTIMONIAL style pattern - fallback)
    if (Array.isArray(contactInfo) && contactInfo.length > 0) {
      return contactInfo
        .filter((i) => i.isVisible)
        .map((item) => {
          const IconComponent = iconMap[item.imageUrl || ""] || Info;
          return {
            icon: IconComponent,
            text: item.content?.[locale] || item.title?.[locale] || "",
          };
        });
    }

    return defaultContactInfo;
  }, [contactInfo, locale, t]);

  const renderSocialLinks =
    socialLinks && socialLinks.length > 0
      ? socialLinks
          .filter((i) => i.isVisible)
          .map((item) => {
            const IconComponent = iconMap[item.imageUrl || ""] || ExternalLink;
            return {
              icon: IconComponent,
              href: item.metadata?.link || "#",
            };
          })
      : defaultSocialLinks;

  return (
    <footer className="bg-gray-900 text-white font-lexend">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/assets/WCSA_logo.jpg"
                alt="Logo"
                width={150}
                height={50}
                className="h-10 w-auto rounded-md"
              />
            </Link>
            <p className="text-gray-400 text-sm">{t("about")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              {renderQuickLinks.map((link, idx) => (
                <li key={`${link.name}-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contactUs")}</h3>
            <ul className="space-y-3">
              {renderContactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <item.icon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-primary-foreground/70" />
                  <span className="text-gray-400">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("stayUpdated")}</h3>
            <p className="text-gray-400 mb-4 text-sm">{t("socialMedia")}</p>
            <div className="flex space-x-4">
              {renderSocialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full transition-colors border border-gray-700 hover:border-primary/50"
                  aria-label="Social Link"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
