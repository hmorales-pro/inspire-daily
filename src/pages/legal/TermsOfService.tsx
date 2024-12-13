import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/BackButton";

const TermsOfService = () => {
  const { t } = useTranslation('pages');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-4xl font-bold mb-4">{t('legal.terms.title')}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {t('legal.terms.lastUpdate')}: 2024-03-20
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.sections.acceptance.title')}</h2>
          <p className="text-gray-600">{t('legal.terms.sections.acceptance.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.sections.services.title')}</h2>
          <p className="text-gray-600">{t('legal.terms.sections.services.content')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.sections.accounts.title')}</h2>
          <p className="text-gray-600">{t('legal.terms.sections.accounts.content')}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;