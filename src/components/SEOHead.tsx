import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export const SEOHead = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  const title = isEnglish 
    ? "Inspire Daily - Your daily inspiration for social media"
    : "Inspire Daily - Votre inspiration quotidienne pour les réseaux sociaux";

  const description = isEnglish
    ? "Inspire Daily helps you create authentic content for your social media with an inspiring question every day."
    : "Inspire Daily vous aide à créer du contenu authentique pour vos réseaux sociaux avec une question inspirante chaque jour.";

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og-image.png" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/og-image.png" />
    </Helmet>
  );
};