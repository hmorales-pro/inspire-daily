import { useTranslation } from "react-i18next";
import { FooterSection } from "./footer/FooterSection";
import { FooterLink } from "./footer/FooterLink";
import { NewsletterForm } from "./footer/NewsletterForm";
import { Copyright } from "./footer/Copyright";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterSection title={t('footer.about.title')}>
            <ul className="space-y-4">
              <li><FooterLink to="/about">{t('footer.about.aboutUs')}</FooterLink></li>
              <li><FooterLink to="/contact">{t('footer.about.contact')}</FooterLink></li>
              <li><FooterLink to="/support">{t('footer.about.support')}</FooterLink></li>
            </ul>
          </FooterSection>

          <FooterSection title={t('footer.legal.title')}>
            <ul className="space-y-4">
              <li><FooterLink to="/legal/terms">{t('footer.legal.terms')}</FooterLink></li>
              <li><FooterLink to="/legal/privacy">{t('footer.legal.privacy')}</FooterLink></li>
              <li><FooterLink to="/legal/notice">{t('footer.legal.notice')}</FooterLink></li>
            </ul>
          </FooterSection>

          <FooterSection title={t('footer.social.title')}>
            <ul className="space-y-4">
              <li>
                <FooterLink to="https://www.linkedin.com/in/hmorales-pro/" external>
                  LinkedIn
                </FooterLink>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title={t('footer.newsletter.title')}>
            <p className="text-base text-gray-500">
              {t('footer.newsletter.description')}
            </p>
            <NewsletterForm />
          </FooterSection>
        </div>

        <Copyright />
      </div>
    </footer>
  );
};