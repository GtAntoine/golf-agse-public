import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { ProfileData } from '../types';

const initialProfile: ProfileData = {
  firstname: '',
  lastname: '',
  birthdate: '',
  phone: '',
  address: '',
  postalcode: '',
  city: '',
  ffglicense: '',
  email: '',
  emergencycontact: '',
  emergencyphone: '',
  golfindex: null,
  birthplace: '',
};

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setMessage({
          type: 'error',
          text: 'Erreur lors du chargement du profil'
        });
        return;
      }

      if (data) {
        setProfile({
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          birthdate: data.birthdate || '',
          phone: data.phone || '',
          address: data.address || '',
          postalcode: data.postalcode || '',
          city: data.city || '',
          ffglicense: data.ffglicense || '',
          email: user.email || '',
          emergencycontact: data.emergencycontact || '',
          emergencyphone: data.emergencyphone || '',
          golfindex: data.golfindex || null,
          birthplace: data.birthplace || '',
        });
      } else {
        // Profile doesn't exist yet, keep default values but set email
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement du profil'
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Remove email from the update payload since it's managed by Auth
      const { email, ...profileData } = profile;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Profil mis à jour avec succès'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la mise à jour du profil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'golfindex' ? (value ? Number(value) : null) : value
    }));
  };

  return {
    profile,
    loading,
    message,
    handleSubmit,
    handleChange
  };
}