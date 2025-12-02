import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';

export function useMembershipForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkExistingApplication();
  }, []);

  async function checkExistingApplication() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
      const startDate = new Date(startYear, 8, 1).toISOString();

      const { data: applications, error } = await supabase
        .from('membership_applications')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .limit(1);

      if (error) throw error;

      setHasExistingApplication(applications && applications.length > 0);
    } catch (error) {
      console.error('Error checking existing application:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Vérifier à nouveau l'existence d'une demande
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
      const startDate = new Date(startYear, 8, 1).toISOString();

      const { data: existingApplications } = await supabase
        .from('membership_applications')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .limit(1);

      if (existingApplications && existingApplications.length > 0) {
        setMessage({
          type: 'error',
          text: 'Vous avez déjà soumis une demande d\'adhésion pour l\'année en cours.'
        });
        return;
      }

      const formData = new FormData(e.target as HTMLFormElement);
      
      // Mettre à jour le profil avec toutes les informations
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          firstname: formData.get('firstname'),
          lastname: formData.get('lastname'),
          birthdate: formData.get('birthdate'),
          phone: formData.get('phone'),
          address: formData.get('address'),
          postalcode: formData.get('postalcode'),
          city: formData.get('city'),
          emergencycontact: formData.get('emergencycontact') || null,
          emergencyphone: formData.get('emergencyphone') || null,
          ffglicense: formData.get('ffglicense') || null,
          golfindex: formData.get('golfindex') ? Number(formData.get('golfindex')) : null,
          updated_at: new Date().toISOString(),
          birthplace: formData.get('birthplace'),
          
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Créer la demande d'adhésion
      const { data: application, error: applicationError } = await supabase
        .from('membership_applications')
        .insert([{
          user_id: user.id,
          membershiptype: formData.get('membershiptype'),
          licensetype: formData.get('licensetype')
        }])
        .select()
        .single();

      if (applicationError) throw applicationError;
      
      navigate(`/payment/${application.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({
        type: 'error',
        text: 'Une erreur est survenue lors de l\'envoi du formulaire.'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    hasExistingApplication,
    loading,
    message,
    handleSubmit
  };
}