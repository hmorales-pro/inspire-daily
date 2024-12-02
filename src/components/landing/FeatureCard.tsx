interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <div className="bg-gray-50 p-6 rounded-lg text-center animate-fade-in">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-primary-dark">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);