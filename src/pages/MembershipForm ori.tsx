import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { MEMBERSHIP_TYPES, LICENSE_TYPES } from '../constants';
import { AlertCircle } from 'lucide-react';

export default function MembershipForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    address: '',
    postalcode: '',
    city: '',
    birthdate: '',
    phone: '',
    emergencycontact: '',
    emergencyphone: '',
    membershiptype: 'GOLF',
    ffglicense: '',
    golfindex: '',
    licensetype: 'none'
  });

  useEffect(() => {
    loadUserProfile();
    checkExistingApplication();
  }, []);

  async function checkExistingApplication() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
      const startDate = new Date(startYear, 8, 1).toISOString(); // 1er septembre

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

  async function loadUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          firstname: profile.firstname || '',
          lastname: profile.lastname || '',
          address: profile.address || '',
          postalcode: profile.postalcode || '',
          city: profile.city || '',
          birthdate: profile.birthdate || '',
          phone: profile.phone || '',
          ffglicense: profile.ffglicense || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
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
        setLoading(false);
        return;
      }

      // Créer la demande d'adhésion
      const { data: application, error } = await supabase
        .from('membership_applications')
        .insert([{
          ...formData,
          user_id: user.id,
          ffglicense: formData.ffglicense || null,
          golfindex: formData.golfindex ? Number(formData.golfindex) : null,
          emergencycontact: formData.emergencycontact || null,
          emergencyphone: formData.emergencyphone || null
        }])
        .select()
        .single();

      if (error) throw error;
      
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (hasExistingApplication) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Formulaire d'adhésion AGSE Golf</h2>
        <div className="bg-yellow-50 p-4 rounded-md flex items-center gap-2 text-yellow-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>
            Vous avez déjà soumis une demande d'adhésion pour l'année en cours. 
            Veuillez attendre la validation de votre demande ou contacter un administrateur 
            si vous avez des questions.
          </p>
        </div>
      </div>
    );
  }

  // ... reste du code du formulaire inchangé ...