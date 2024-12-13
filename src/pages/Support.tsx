import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Support = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-primary-light">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">{t('pages.support.title')}</h1>
        <p className="text-lg text-gray-600 mb-12">{t('pages.support.description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">
              {t('pages.support.sections.faq.title')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('pages.support.sections.faq.description')}
            </p>
            <Link
              to="#"
              className="text-primary hover:text-primary-dark font-medium"
            >
              {t('common.readMore')} →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">
              {t('pages.support.sections.contact.title')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('pages.support.sections.contact.description')}
            </p>
            <Link
              to="/contact"
              className="text-primary hover:text-primary-dark font-medium"
            >
              {t('common.contact')} →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">
              {t('pages.support.sections.resources.title')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('pages.support.sections.resources.description')}
            </p>
            <Link
              to="#"
              className="text-primary hover:text-primary-dark font-medium"
            >
              {t('common.explore')} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;