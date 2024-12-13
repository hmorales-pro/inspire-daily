import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-primary-light">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">{t('pages.about.title')}</h1>
        <p className="text-lg text-gray-600 mb-12">{t('pages.about.description')}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('pages.about.mission.title')}</h2>
          <p className="text-gray-600">{t('pages.about.mission.description')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">{t('pages.about.values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">
                {t('pages.about.values.authenticity.title')}
              </h3>
              <p className="text-gray-600">
                {t('pages.about.values.authenticity.description')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">
                {t('pages.about.values.creativity.title')}
              </h3>
              <p className="text-gray-600">
                {t('pages.about.values.creativity.description')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">
                {t('pages.about.values.community.title')}
              </h3>
              <p className="text-gray-600">
                {t('pages.about.values.community.description')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;