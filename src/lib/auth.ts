
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const logActivity = async (user: User | null, action: string, resource?: string, details?: any) => {
  if (!user) return;

  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      resource,
      details,
      ip_address: null, // IP address is better handled server-side if needed
      user_agent: navigator.userAgent
    });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
