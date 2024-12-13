import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { t } = useTranslation(['pages']);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: t('pages.contact.form.success'),
      description: "We'll get back to you soon!",
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('pages.contact.title')}</h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('pages.contact.description')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('pages.contact.form.name')}
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('pages.contact.form.email')}
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            {t('pages.contact.form.message')}
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          {t('pages.contact.form.send')}
        </Button>
      </form>
    </div>
  );
};

export default Contact;