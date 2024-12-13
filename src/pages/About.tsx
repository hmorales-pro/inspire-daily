import { useTranslation } from "react-i18next";
import { BackButton } from "@/components/BackButton";

const About = () => {
  const { t } = useTranslation('pages');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-4xl font-bold mb-8">{t('about.title')}</h1>
      <p className="text-lg text-gray-600 mb-12">
        {t('about.description')}
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('about.mission.title')}</h2>
        <p className="text-gray-600">
          {t('about.mission.description')}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">{t('about.values.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-3">
              {t('about.values.authenticity.title')}
            </h3>
            <p className="text-gray-600">
              {t('about.values.authenticity.description')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-3">
              {t('about.values.creativity.title')}
            </h3>
            <p className="text-gray-600">
              {t('about.values.creativity.description')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-3">
              {t('about.values.community.title')}
            </h3>
            <p className="text-gray-600">
              {t('about.values.community.description')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;