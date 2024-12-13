import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BackButton } from "@/components/BackButton";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const { t } = useTranslation('pages');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: data,
      });

      if (error) throw error;

      toast({
        title: t('contact.form.success'),
        description: t('contact.form.successDescription'),
      });

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t('contact.form.error'),
        description: t('contact.form.errorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('contact.description')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('contact.form.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('contact.form.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            {t('contact.form.message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('common:loading') : t('contact.form.send')}
        </Button>
      </form>
    </div>
  );
};

export default Contact;