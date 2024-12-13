import { FeatureCard } from "./FeatureCard";
import { useTranslation } from "react-i18next";

export const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-dark">
          {t('landing.features.title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title={t('landing.features.sections.dailyQuestions.title')}
            description={t('landing.features.sections.dailyQuestions.description')}
            icon="✨"
          />
          <FeatureCard
            title={t('landing.features.sections.guaranteedInspiration.title')}
            description={t('landing.features.sections.guaranteedInspiration.description')}
            icon="💡"
          />
          <FeatureCard
            title={t('landing.features.sections.customContent.title')}
            description={t('landing.features.sections.customContent.description')}
            icon="🎯"
          />
          <FeatureCard
            title={t('landing.features.sections.voiceInput.title')}
            description={t('landing.features.sections.voiceInput.description')}
            icon="🎤"
          />
          <FeatureCard
            title={t('landing.features.sections.aiAssistant.title')}
            description={t('landing.features.sections.aiAssistant.description')}
            icon="🤖"
          />
          <FeatureCard
            title={t('landing.features.sections.completeHistory.title')}
            description={t('landing.features.sections.completeHistory.description')}
            icon="📚"
          />
        </div>
      </div>
    </div>
  );
};