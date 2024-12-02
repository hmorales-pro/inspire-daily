import { Response } from '@/lib/supabase';

export const filterResponsesBySubscription = (responses: Response[] | undefined, subscriptionType: string | undefined): Response[] => {
  if (!responses) return [];
  
  if (subscriptionType === 'premium') {
    return responses;
  }

  // Pour les utilisateurs gratuits, limiter à 30 jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return responses.filter(response => {
    const responseDate = new Date(response.created_at!);
    return responseDate >= thirtyDaysAgo;
  });
};