import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpyvlzstxtdrqolmrlgj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweXZsenN0eHRkcnFvbG1ybGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjc3NjEsImV4cCI6MjA0ODcwMzc2MX0.2COQ2dIHh7HhMnNDJnplarmMaZ9wGjnPvnRN8kSDHyk';

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