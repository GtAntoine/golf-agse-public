import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { AuditLogType } from '../../../types';

export function useAuditLog(memberId: string | undefined) {
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberId) fetchAuditLogs();
  }, [memberId]);

  async function fetchAuditLogs() {
    try {
      // D'abord récupérer le user_id de l'application
      const { data: application } = await supabase
        .from('membership_applications')
        .select('user_id')
        .eq('id', memberId)
        .single();

      if (!application?.user_id) return;

      const { data, error } = await supabase
        .from('member_audit_log')
        .select('*')
        .eq('user_id', application.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  return { auditLogs, loading, refreshLogs: fetchAuditLogs };
}