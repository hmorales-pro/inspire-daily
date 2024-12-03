import { supabase } from './supabase';

export const getAppSettings = async (key: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching app setting:', error);
    return null;
  }

  return data?.value || null;
};