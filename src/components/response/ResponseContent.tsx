import React from 'react';
import { ResponseActions } from './ResponseActions';
import { CopyButton } from './CopyButton';
import { ResponseTitle } from './ResponseTitle';

interface ResponseContentProps {
  content: string;
  isOptimizing: boolean;
  profile: any;
  onEdit: () => void;
  onOptimize: () => void;
  isOriginalVersion?: boolean;
}

export const ResponseContent = ({
  content,
  isOptimizing,
  profile,
  onEdit,
  onOptimize,
  isOriginalVersion = true
}: ResponseContentProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <ResponseTitle isOriginalVersion={isOriginalVersion} />
        <div className="flex items-center gap-2">
          <CopyButton content={content} />
          <ResponseActions
            isOptimizing={isOptimizing}
            profile={profile}
            onEdit={onEdit}
            onOptimize={onOptimize}
            showOptimize={isOriginalVersion}
          />
        </div>
      </div>
      <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
    </div>
  );
};