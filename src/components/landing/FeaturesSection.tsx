import { FeatureCard } from "./FeatureCard";
import { useTranslation } from "react-i18next";

export const FeaturesSection = () => {
  const { t } = useTranslation('landing');

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-dark">
          {t('features.title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title={t('features.sections.dailyQuestions.title')}
            description={t('features.sections.dailyQuestions.description')}
            icon="✨"
          />
          <FeatureCard
            title={t('features.sections.guaranteedInspiration.title')}
            description={t('features.sections.guaranteedInspiration.description')}
            icon="💡"
          />
          <FeatureCard
            title={t('features.sections.customContent.title')}
            description={t('features.sections.customContent.description')}
            icon="🎯"
          />
          <FeatureCard
            title={t('features.sections.voiceInput.title')}
            description={t('features.sections.voiceInput.description')}
            icon="🎤"
          />
          <FeatureCard
            title={t('features.sections.aiAssistant.title')}
            description={t('features.sections.aiAssistant.description')}
            icon="🤖"
          />
          <FeatureCard
            title={t('features.sections.completeHistory.title')}
            description={t('features.sections.completeHistory.description')}
            icon="📚"
          />
        </div>
      </div>
    </div>
  );
};