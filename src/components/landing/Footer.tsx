import { useTranslation } from "react-i18next";
import { FooterSection } from "./footer/FooterSection";
import { FooterLink } from "./footer/FooterLink";
import { Copyright } from "./footer/Copyright";

export const Footer = () => {
  const { t } = useTranslation('footer');

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FooterSection title={t('about.title')}>
            <ul className="space-y-4">
              <li><FooterLink to="/about">{t('about.aboutUs')}</FooterLink></li>
              <li><FooterLink to="/contact">{t('about.contact')}</FooterLink></li>
              <li><FooterLink to="/support">{t('about.support')}</FooterLink></li>
            </ul>
          </FooterSection>

          <FooterSection title={t('legal.title')}>
            <ul className="space-y-4">
              <li><FooterLink to="/legal/terms">{t('legal.terms')}</FooterLink></li>
              <li><FooterLink to="/legal/privacy">{t('legal.privacy')}</FooterLink></li>
              <li><FooterLink to="/legal/notice">{t('legal.notice')}</FooterLink></li>
            </ul>
          </FooterSection>

          <FooterSection title={t('social.title')}>
            <ul className="space-y-4">
              <li>
                <FooterLink to="https://www.linkedin.com/in/hmorales-pro/" external>
                  LinkedIn
                </FooterLink>
              </li>
            </ul>
          </FooterSection>
        </div>

        <Copyright />
      </div>
    </footer>
  );
};