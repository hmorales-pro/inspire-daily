import { FooterSection } from "./footer/FooterSection";
import { FooterLink } from "./footer/FooterLink";
import { NewsletterForm } from "./footer/NewsletterForm";
import { Copyright } from "./footer/Copyright";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterSection title="À propos">
            <ul className="space-y-4">
              <li><FooterLink to="/about">À propos de nous</FooterLink></li>
              <li><FooterLink to="/contact">Contact</FooterLink></li>
              <li><FooterLink to="/support">Support</FooterLink></li>
            </ul>
          </FooterSection>

          <FooterSection title="Légal">
            <ul className="space-y-4">
              <li><FooterLink to="/legal/terms">Conditions d'utilisation</FooterLink></li>
              <li><FooterLink to="/legal/privacy">Politique de confidentialité</FooterLink></li>
              <li><FooterLink to="/legal/notice">Mentions légales</FooterLink></li>
            </ul>
          </FooterSection>

          <FooterSection title="Réseaux sociaux">
            <ul className="space-y-4">
              <li>
                <FooterLink to="https://twitter.com/inspiredaily" external>
                  Twitter
                </FooterLink>
              </li>
              <li>
                <FooterLink to="https://instagram.com/inspiredaily" external>
                  Instagram
                </FooterLink>
              </li>
              <li>
                <FooterLink to="https://linkedin.com/company/inspiredaily" external>
                  LinkedIn
                </FooterLink>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Newsletter">
            <p className="text-base text-gray-500">
              Recevez nos actualités et conseils pour créer du contenu engageant.
            </p>
            <NewsletterForm />
          </FooterSection>
        </div>

        <Copyright />
      </div>
    </footer>
  );
};