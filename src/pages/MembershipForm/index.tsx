import React, { useEffect, useState } from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import { MembershipFormProvider } from './context/MembershipFormContext';
import { useMembershipForm } from './hooks/useMembershipForm';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { MembershipTypeSelection } from '../../components/membership/MembershipTypeSelection';
import { LicenseTypeSelection } from '../../components/membership/LicenseTypeSelection';
import { TotalAmount } from '../../components/membership/TotalAmount';
import { supabase } from '../../supabaseClient';
import { MembershipApplication } from '../../types';
import { useMembershipPrices } from '../../hooks/useMembershipPrices';

export default function MembershipForm() {
  const { 
    hasExistingApplication,
    loading,
    message,
    handleSubmit
  } = useMembershipForm();

  const { getCurrentYear } = useMembershipPrices();
  const year = getCurrentYear();

  const [existingApplication, setExistingApplication] = useState<MembershipApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Déterminer si on est en période de renouvellement (septembre ou après)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0 = janvier, 8 = septembre
  const isRenewalPeriod = currentMonth >= 8

  useEffect(() => {
    if (hasExistingApplication) {
      fetchExistingApplication();
    } else {
      setIsLoading(false);
    }
  }, [hasExistingApplication]);

  async function fetchExistingApplication() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // First get the application
      const { data: appData, error: appError } = await supabase
        .from('membership_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (appError) throw appError;

      // Then get the profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('firstname, lastname')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Combine the data
      const combinedData = {
        ...appData,
        profiles: profileData
      };

      setExistingApplication(combinedData);
    } catch (error) {
      console.error('Error fetching existing application:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (hasExistingApplication && existingApplication) {
    // Générer la référence uniquement si nous avons les données nécessaires
    const reference = existingApplication.profiles?.lastname && existingApplication.profiles?.firstname
      ? `${existingApplication.profiles.lastname.toUpperCase()} ${existingApplication.profiles.firstname.toUpperCase()} ADH${year}`
      : '';

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-6">Formulaire d'adhésion AGSE Golf</h2>
          <div className="bg-yellow-50 p-4 rounded-md flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              Vous avez déjà soumis une demande d'adhésion pour l'année {year}. 
              Veuillez attendre la validation de votre demande ou contacter un administrateur 
              si vous avez des questions.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Informations de paiement</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Coordonnées bancaires</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Titulaire du compte</p>
                  <p className="font-medium">ASSOC. AGSE GOLF</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">IBAN</p>
                  <p className="font-medium">FR76 1820 6000 8965 0518 0098 703</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">BIC</p>
                  <p className="font-medium">AGRIFRPP882</p>
                </div>
                {reference && (
                  <div>
                    <p className="text-gray-600 text-sm">Référence à indiquer</p>
                    <code className="bg-gray-100 px-3 py-1 rounded font-mono">
                      {reference}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Important :</strong> Merci d'indiquer exactement cette référence lors de votre virement 
                pour nous permettre d'identifier votre paiement.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MembershipFormProvider>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Formulaire d'adhésion AGSE Golf {year}
        </h2>

        {/* Message d'information sur la période d'inscription */}
        {isRenewalPeriod && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Période de renouvellement</p>
                <p className="text-sm mt-1">
                  À partir de septembre, votre adhésion sera valable jusqu'à la fin de l'année en cours 
                  <strong> ET pour toute l'année {year}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-4 p-4 rounded-md flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <PersonalInfoForm />
          <MembershipTypeSelection />
          <LicenseTypeSelection />
          <TotalAmount />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Envoyer la demande d'adhésion"}
            </button>
          </div>
        </form>
      </div>
    </MembershipFormProvider>
  );
}