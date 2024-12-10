import { ReactNode } from "react";

interface FooterSectionProps {
  title: string;
  children: ReactNode;
}

export const FooterSection = ({ title, children }: FooterSectionProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
};