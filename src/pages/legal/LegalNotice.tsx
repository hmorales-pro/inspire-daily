import { useTranslation } from "react-i18next";

const LegalNotice = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('pages.legal.notice.title')}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {t('pages.legal.notice.lastUpdate')}: 2024-03-20
      </p>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t('pages.legal.notice.sections.company.title')}
          </h2>
          <p className="text-gray-600">
            {t('pages.legal.notice.sections.company.content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t('pages.legal.notice.sections.hosting.title')}
          </h2>
          <p className="text-gray-600">
            {t('pages.legal.notice.sections.hosting.content')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t('pages.legal.notice.sections.contact.title')}
          </h2>
          <p className="text-gray-600">
            {t('pages.legal.notice.sections.contact.content')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalNotice;