import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { MembershipType, LicenseType } from '../../../types';

interface FormData {
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  postalcode: string;
  city: string;
  birthdate: string;
  phone: string;
  emergencycontact: string;
  emergencyphone: string;
  membershiptype: MembershipType;
  ffglicense: string;
  golfindex: string;
  licensetype: LicenseType;
  birthplace: string;
}

interface MembershipFormContextType {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  updateMultipleFields: (fields: Partial<FormData>) => void;
}

const initialFormData: FormData = {
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
  licensetype: 'none',
  birthplace: '',
};

const MembershipFormContext = createContext<MembershipFormContextType | undefined>(undefined);

export function MembershipFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

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
          ffglicense: profile.ffglicense || '',
          emergencycontact: profile.emergencycontact || '',
          emergencyphone: profile.emergencyphone || '',
          golfindex: profile.golfindex?.toString() || '',
          birthplace: profile.birthplace || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMultipleFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...fields
    }));
  };

  return (
    <MembershipFormContext.Provider value={{ formData, updateFormData, updateMultipleFields }}>
      {children}
    </MembershipFormContext.Provider>
  );
}

export function useMembershipFormContext() {
  const context = useContext(MembershipFormContext);
  if (context === undefined) {
    throw new Error('useMembershipFormContext must be used within a MembershipFormProvider');
  }
  return context;
}