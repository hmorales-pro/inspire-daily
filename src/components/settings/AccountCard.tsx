import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccountCardProps {
  email: string | undefined;
}

export const AccountCard = ({ email }: AccountCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate('/login');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.account.title')}</CardTitle>
        <CardDescription>
          {t('settings.account.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">{t('settings.account.email')}</p>
          <p className="text-muted-foreground">{email}</p>
        </div>
        <Button onClick={handleSignOut} variant="destructive" className="w-full">
          {t('settings.account.logout')}
        </Button>
      </CardContent>
    </Card>
  );
};