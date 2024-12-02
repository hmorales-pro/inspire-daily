import { supabase } from '@/integrations/supabase/client';

export const optimizeResponse = async (response: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('optimize-response', {
      body: { response }
    });

    if (error) throw error;
    return data.optimizedContent;
  } catch (error) {
    console.error('Error optimizing response:', error);
    throw new Error('Failed to optimize response');
  }
};