import { Link } from "react-router-dom";

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  external?: boolean;
}

export const FooterLink = ({ to, children, external = false }: FooterLinkProps) => {
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base text-gray-500 hover:text-gray-900"
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className="text-base text-gray-500 hover:text-gray-900">
      {children}
    </Link>
  );
};