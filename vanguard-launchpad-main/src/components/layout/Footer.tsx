import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Send, Music2 } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Contact", path: "/contact" },
  ],
  services: [
    { name: "Content Creation", path: "/services#content" },
    { name: "Social Media", path: "/services#social" },
    { name: "Paid Advertising", path: "/services#ads" },
    { name: "Branding & Design", path: "/services#branding" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ],
};

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/vanguardmarketing1?igsh=MTd5YnI2amU3Z3RnZw==",
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/1Ancz8zWJe/",
    label: "Facebook",
  },
  {
    icon: Send,
    href: "https://t.me/VanguardMarketing",
    label: "Telegram",
  },
  {
    icon: Music2,
    href: "https://www.tiktok.com/@vanguard_marketing?_r=1&_t=ZS-93SLfg1dTHg",
    label: "TikTok",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-navy-dark border-t border-border/30">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-border/50 bg-secondary/20">
                <img
                  src="/assets/vanguard-logo.jpg"
                  alt="Vanguard Marketing"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We scale businesses using strategic digital marketing. More customers. More visibility. Real growth.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Harar / Dire Dawa, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a
                  href="tel:+251922661434"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  +251 922 661 434
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a
                  href="mailto:vanguardmarketing123@gmail.com"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  vanguardmarketing123@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Vanguard Marketing. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
