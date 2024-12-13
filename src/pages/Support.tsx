import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/BackButton";

const Support = () => {
  const { t } = useTranslation('pages');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-4xl font-bold mb-8">{t('support.title')}</h1>
      <p className="text-lg text-gray-600 mb-12">
        {t('support.description')}
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t('support.sections.faq.title')}</h2>
          <p className="text-gray-600">{t('support.sections.faq.description')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t('support.sections.contact.title')}</h2>
          <p className="text-gray-600">{t('support.sections.contact.description')}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t('support.sections.resources.title')}</h2>
          <p className="text-gray-600">{t('support.sections.resources.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default Support;