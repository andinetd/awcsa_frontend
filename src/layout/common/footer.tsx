import { Facebook, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const t = require("next-intl").useTranslations();
  const quickLinks = [
    { name: t("footer.home"), href: "/" },
    { name: t("footer.services"), href: "#services" },
    { name: t("footer.feedback"), href: "#feedback" },
    { name: t("footer.products"), href: "/products" },
    { name: t("footer.login"), href: "/login" },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: t("footer.address"),
    },
    { icon: Phone, text: t("footer.phone") },
    { icon: Mail, text: t("footer.email") },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://web.facebook.com/AABWCS" },
    {
      icon: Twitter,
      href: "https://x.com/bowcsa?t=2VCCz3kWshrTsLQrKnO_Fw&s=35",
    },
    { icon: Linkedin, href: "#" },
  ];

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
            <p className="text-gray-400 text-sm">{t("footer.about")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
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
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <item.icon className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.stayUpdated")}
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              {t("footer.socialMedia")}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
