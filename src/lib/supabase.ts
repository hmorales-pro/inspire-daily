import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Response {
  id?: number;
  question: string;
  response: string;
  created_at?: string;
  is_optimized: boolean;
  optimized_response?: string;
}

export const saveResponse = async (response: Omit<Response, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('responses')
    .insert(response)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getResponses = async () => {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};