import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/BackButton";

const LegalNotice = () => {
  const { t } = useTranslation('legal');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-4xl font-bold mb-4">{t('notice.title')}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {t('notice.lastUpdate')}: 2024-03-20
      </p>

      <div className="space-y-8">
        {Object.entries(t('notice.sections', { returnObjects: true })).map(([key, section]: [string, any]) => (
          <section key={key}>
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <p className="text-gray-600">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default LegalNotice;