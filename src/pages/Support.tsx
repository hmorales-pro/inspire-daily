import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Support = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('pages.support.title')}</h1>
      <p className="text-lg text-gray-600 mb-12">
        {t('pages.support.description')}
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.support.sections.faq.title')}</CardTitle>
            <CardDescription>
              {t('pages.support.sections.faq.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* FAQ content will be added here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('pages.support.sections.contact.title')}</CardTitle>
            <CardDescription>
              {t('pages.support.sections.contact.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Contact information will be added here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('pages.support.sections.resources.title')}</CardTitle>
            <CardDescription>
              {t('pages.support.sections.resources.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Resources content will be added here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;