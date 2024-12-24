import { useTranslation } from 'react-i18next';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';

interface AccountCardProps {
  email?: string;
  emailNotifications?: boolean;
}

export const AccountCard = ({ email, emailNotifications = true }: AccountCardProps) => {
  const { t } = useTranslation(['settings', 'common']);
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(emailNotifications);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleNotificationsToggle = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ email_notifications: !isNotificationsEnabled })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      setIsNotificationsEnabled(!isNotificationsEnabled);
      toast({
        description: t('settings:account.notifications.success'),
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast({
        variant: "destructive",
        description: t('settings:account.notifications.error'),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings:account.title')}</CardTitle>
        <CardDescription>{t('settings:account.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">{t('settings:account.email')}</h3>
          <p>{email}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">{t('settings:account.notifications.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('settings:account.notifications.description')}
          </p>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isNotificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
            />
            <span className="text-sm">
              {isNotificationsEnabled 
                ? t('settings:account.notifications.enabled')
                : t('settings:account.notifications.disabled')
              }
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full"
        >
          {t('settings:account.logout')}
        </Button>
      </CardContent>
    </Card>
  );
};