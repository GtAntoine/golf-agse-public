import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { PaymentHistory, MemberType } from '../../../types';

export function usePaymentHistory(memberId: string | undefined) {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberId) {
      fetchPaymentHistory(memberId);
    }
  }, [memberId]);

  async function fetchPaymentHistory(id: string) {
    try {
      // First get the user_id from the application
      const { data: application } = await supabase
        .from('membership_applications')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!application?.user_id) return;

      // Then get payment history using the user_id
      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('profile_id', application.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentHistory(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePaymentUpdate = async (year: number, type: 'membership' | 'license') => {
    try {
      // Get user_id first
      const { data: application } = await supabase
        .from('membership_applications')
        .select('user_id')
        .eq('id', memberId)
        .single();

      if (!application?.user_id) return;

      const payment = paymentHistory.find(p => p.year === year);
      const field = `${type}_paid`;

      if (payment) {
        // Update existing payment record
        const { error } = await supabase
          .from('payment_history')
          .update({ [field]: !payment[field] })
          .eq('id', payment.id);

        if (error) throw error;
      } else {
        // Create new payment record
        const { error } = await supabase
          .from('payment_history')
          .insert([{
            profile_id: application.user_id,
            year,
            [field]: true
          }]);

        if (error) throw error;
      }

      // Refresh payment history
      await fetchPaymentHistory(memberId!);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleMemberTypeUpdate = async (year: number, type: MemberType) => {
    try {
      // Get user_id first
      const { data: application } = await supabase
        .from('membership_applications')
        .select('user_id')
        .eq('id', memberId)
        .single();

      if (!application?.user_id) return;

      const payment = paymentHistory.find(p => p.year === year);

      if (payment) {
        // Update existing payment record
        const { error } = await supabase
          .from('payment_history')
          .update({ member_type: type })
          .eq('id', payment.id);

        if (error) throw error;
      } else {
        // Create new payment record
        const { error } = await supabase
          .from('payment_history')
          .insert([{
            profile_id: application.user_id,
            year,
            member_type: type
          }]);

        if (error) throw error;
      }

      // Refresh payment history
      await fetchPaymentHistory(memberId!);
    } catch (error) {
      console.error('Error updating member type:', error);
    }
  };

  const handleValidate = async (year: number, validated: boolean) => {
    try {
      const payment = paymentHistory.find(p => p.year === year);
      if (!payment) return;

      const { error } = await supabase
        .from('payment_history')
        .update({ 
          validated,
          validated_at: validated ? new Date().toISOString() : null
        })
        .eq('id', payment.id);

      if (error) throw error;

      // Refresh payment history
      await fetchPaymentHistory(memberId!);
    } catch (error) {
      console.error('Error updating validation status:', error);
    }
  };

  return {
    paymentHistory,
    handlePaymentUpdate,
    handleMemberTypeUpdate,
    handleValidate,
    loading,
    refreshHistory: () => fetchPaymentHistory(memberId!)
  };
}