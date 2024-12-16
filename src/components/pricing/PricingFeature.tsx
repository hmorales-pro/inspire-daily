import { Check } from "lucide-react";

interface PricingFeatureProps {
  text: string;
}

export const PricingFeature = ({ text }: PricingFeatureProps) => (
  <li className="flex items-center space-x-2">
    <Check className="h-5 w-5 text-primary flex-shrink-0" />
    <span className="text-gray-600">{text}</span>
  </li>
);