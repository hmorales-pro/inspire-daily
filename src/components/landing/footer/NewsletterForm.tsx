import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const NewsletterForm = () => {
  const { t } = useTranslation();

  return (
    <form className="mt-4">
      <input
        type="email"
        placeholder={t('footer.newsletter.emailPlaceholder')}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
      />
      <Button
        type="submit"
        className="mt-2 w-full"
      >
        {t('footer.newsletter.subscribe')}
      </Button>
    </form>
  );
};