import { useTranslation } from 'react-i18next';

interface ResponseTitleProps {
  isOriginalVersion: boolean;
}

export const ResponseTitle = ({ isOriginalVersion }: ResponseTitleProps) => {
  const { t } = useTranslation(['history']);
  
  return (
    <h3 className="font-medium">
      {isOriginalVersion ? t('response.originalVersion') : t('response.optimizedVersion')}
    </h3>
  );
};