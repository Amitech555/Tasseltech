import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Témoignages", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ],
  company: [
    { label: "À propos", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Carrières", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Confidentialité", href: "#privacy" },
    { label: "Conditions", href: "#terms" },
    { label: "Cookies", href: "#cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">T</span>
              </div>
              <span className="font-display text-xl font-semibold text-foreground">Tasseltech</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Préservez et partagez vos souvenirs familiaux les plus précieux pour les générations futures.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Tasseltech. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-accent fill-accent" /> pour les familles
          </p>
        </div>
      </div>
    </footer>
  );
}
