import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-dark">
          Une expérience unique d'introspection
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Questions quotidiennes"
            description="Recevez chaque jour une nouvelle question stimulante, soigneusement sélectionnée pour approfondir votre réflexion personnelle."
            icon="🎯"
          />
          <FeatureCard
            title="Historique complet"
            description="Gardez une trace de toutes vos réponses et observez votre évolution au fil du temps. Revenez sur vos réflexions passées."
            icon="📚"
          />
          <FeatureCard
            title="Assistant IA"
            description="Utilisez notre assistant IA pour affiner et approfondir vos réponses, obtenant ainsi de nouvelles perspectives."
            icon="✨"
          />
          <FeatureCard
            title="Saisie vocale"
            description="Exprimez-vous naturellement grâce à la reconnaissance vocale. Parlez librement, nous transcrivons pour vous."
            icon="🎤"
          />
          <FeatureCard
            title="Interface intuitive"
            description="Une expérience utilisateur fluide et agréable, conçue pour vous permettre de vous concentrer sur l'essentiel."
            icon="💫"
          />
          <FeatureCard
            title="Fonctionnalités à venir"
            description="De nouvelles fonctionnalités en développement : partage sur les réseaux sociaux, export des données, et bien plus encore..."
            icon="🚀"
          />
        </div>
      </div>
    </div>
  );
};