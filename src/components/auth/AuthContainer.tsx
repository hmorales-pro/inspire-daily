import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen bg-primary-light p-4">
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};