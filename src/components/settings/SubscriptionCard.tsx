import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SubscriptionCardProps {
  profileData: any;
  isUpgrading: boolean;
  handleUpgrade: () => Promise<void>;
}

export const SubscriptionCard = ({ profileData, isUpgrading, handleUpgrade }: SubscriptionCardProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCanceling, setIsCanceling] = useState(false);

  const getOptimizationsLimit = () => {
    if (profileData?.subscription_type === 'premium') return Infinity;
    return 5;
  };

  const getRemainingOptimizations = () => {
    if (profileData?.subscription_type === 'premium') return t('settings.subscription.unlimited');
    return profileData?.optimizations_count || 0;
  };

  const getNextResetDate = () => {
    if (!profileData?.optimizations_reset_date) return null;
    return new Date(profileData.optimizations_reset_date).toLocaleDateString();
  };

  const getProgressValue = () => {
    const limit = getOptimizationsLimit();
    if (limit === Infinity) return 100;
    const count = profileData?.optimizations_count || 0;
    const maxOptimizations = 5;
    return Math.max(0, Math.min(100, (count / maxOptimizations) * 100));
  };

  const handleCancel = async () => {
    try {
      setIsCanceling(true);
      const response = await supabase.functions.invoke('cancel-subscription');
      
      if (response.error) throw response.error;
      
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: t('common.success'),
        description: t('settings.subscription.cancelSuccess'),
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: t('common.error'),
        description: t('settings.subscription.cancelError'),
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.subscription.title')}</CardTitle>
        <CardDescription>
          {t('settings.subscription.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">{t('settings.subscription.type')}</p>
          <p className="text-2xl font-bold capitalize">
            {t(`settings.subscription.${profileData?.subscription_type || 'free'}`)}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">{t('settings.subscription.remainingOptimizations')}</p>
          <Progress 
            value={getProgressValue()}
            className="mb-2"
          />
          <p className="text-sm text-muted-foreground">
            {getRemainingOptimizations()} {t('settings.subscription.optimizations')}
            {getNextResetDate() && ` (${t('settings.subscription.resetDate')} ${getNextResetDate()})`}
          </p>
        </div>

        {profileData?.subscription_type === 'free' ? (
          <Button 
            onClick={handleUpgrade} 
            className="w-full" 
            disabled={isUpgrading}
          >
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('settings.subscription.redirecting')}
              </>
            ) : (
              t('settings.subscription.upgrade')
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleCancel} 
            variant="destructive"
            className="w-full" 
            disabled={isCanceling}
          >
            {isCanceling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('settings.subscription.canceling')}
              </>
            ) : (
              t('settings.subscription.cancel')
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};