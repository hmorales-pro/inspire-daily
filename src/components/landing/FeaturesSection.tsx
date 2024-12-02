import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-dark">
          Créez du contenu qui vous ressemble
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Questions quotidiennes"
            description="Recevez chaque jour une nouvelle question inspirante pour alimenter vos réseaux sociaux avec du contenu authentique et engageant."
            icon="✨"
          />
          <FeatureCard
            title="Inspiration garantie"
            description="Plus besoin de chercher quoi poster : nos questions vous aident à partager votre quotidien et vos expériences de manière naturelle."
            icon="💡"
          />
          <FeatureCard
            title="Contenu personnalisé"
            description="Adaptez vos réponses à votre style et votre audience. Créez du contenu unique qui reflète votre personnalité."
            icon="🎯"
          />
          <FeatureCard
            title="Saisie vocale"
            description="Exprimez-vous naturellement grâce à la reconnaissance vocale. Parlez librement, nous transcrivons pour vous."
            icon="🎤"
          />
          <FeatureCard
            title="Assistant IA"
            description="Affinez vos réponses avec notre assistant IA pour un contenu encore plus impactant sur vos réseaux sociaux."
            icon="🤖"
          />
          <FeatureCard
            title="Historique complet"
            description="Gardez une trace de toutes vos réponses et réutilisez votre contenu quand vous le souhaitez."
            icon="📚"
          />
        </div>
      </div>
    </div>
  );
};