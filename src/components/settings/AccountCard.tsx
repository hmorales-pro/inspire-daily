import { useTranslation } from 'react-i18next';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccountCardProps {
  email?: string;
}

export const AccountCard = ({ email }: AccountCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.account.title')}</CardTitle>
        <CardDescription>{t('settings.account.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{t('settings.account.email')}</h3>
          <p>{email}</p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full"
        >
          {t('settings.account.logout')}
        </Button>
      </CardContent>
    </Card>
  );
};