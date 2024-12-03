import React from 'react';
import { ResponseActions } from './ResponseActions';

interface ResponseContentProps {
  title: string;
  content: string;
  isOptimizing: boolean;
  profile: any;
  onEdit: () => void;
  onOptimize: () => void;
}

export const ResponseContent = ({
  title,
  content,
  isOptimizing,
  profile,
  onEdit,
  onOptimize
}: ResponseContentProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        <ResponseActions
          isOptimizing={isOptimizing}
          profile={profile}
          onEdit={onEdit}
          onOptimize={onOptimize}
        />
      </div>
      <p className="text-muted-foreground">{content}</p>
    </div>
  );
};