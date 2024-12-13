import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-muted-foreground hover:text-primary"
    >
      {i18n.language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
    </Button>
  );
};