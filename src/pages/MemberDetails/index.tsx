import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { MembershipApplication } from '../../types';
import { MemberHeader } from './MemberHeader';
import { PersonalInfo } from '../../components/member/PersonalInfo';
import { PaymentStatus } from '../../components/member/PaymentStatus';
import { AuditLog } from '../../components/member/AuditLog';
import { usePaymentHistory } from './hooks/usePaymentHistory';
import { useAuditLog } from './hooks/useAuditLog';
import { Loader2 } from 'lucide-react';

export default function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<MembershipApplication | null>(null);
  const { 
    paymentHistory, 
    handlePaymentUpdate, 
    handleMemberTypeUpdate,
    handleValidate,
    loading: paymentLoading,
    refreshHistory
  } = usePaymentHistory(id);
  const { auditLogs, loading: auditLoading, refreshLogs } = useAuditLog(id);

  useEffect(() => {
    if (id) fetchMemberDetails();
  }, [id]);

  async function fetchMemberDetails() {
    try {
      // D'abord récupérer le user_id de l'application
      const { data: application, error: applicationError } = await supabase
        .from('membership_applications')
        .select('user_id')
        .eq('id', id)
        .maybeSingle();

      if (applicationError) {
        console.error('Error fetching application:', applicationError);
        return;
      }
      
      if (!application?.user_id) {
        console.error('Application not found or missing user_id');
        return;
      }

      // Ensuite utiliser get_member_details avec le user_id
      const { data, error } = await supabase
        .rpc('get_member_details', { p_user_id: application.user_id });

      if (error) throw error;
      if (data && data.length > 0) {
        setMember(data[0]); // get_member_details retourne un tableau
      } else {
        console.error('No member details found');
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  }

  const handleUpdate = async () => {
    await fetchMemberDetails();
    await refreshHistory();
    await refreshLogs();
  };

  if (!member || paymentLoading || auditLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MemberHeader member={member} />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <PersonalInfo 
            member={member} 
            onUpdate={handleUpdate} 
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <PaymentStatus
            currentYear={new Date().getFullYear()}
            paymentHistory={paymentHistory}
            onPaymentUpdate={async (...args) => {
              await handlePaymentUpdate(...args);
              await refreshLogs();
            }}
            onMemberTypeUpdate={async (...args) => {
              await handleMemberTypeUpdate(...args);
              await refreshLogs();
            }}
            onValidate={async (...args) => {
              await handleValidate(...args);
              await refreshLogs();
            }}
          />
        </div>
      </div>

      <AuditLog logs={auditLogs} />
    </div>
  );
}