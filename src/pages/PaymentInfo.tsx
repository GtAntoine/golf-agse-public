import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { MembershipApplication } from '../types';
import { CreditCard, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMembershipPrices } from './../hooks/useMembershipPrices';

export default function PaymentInfo() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<MembershipApplication | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { getMembershipPrice, getLicensePrice, getCurrentYear } = useMembershipPrices();
  const year = getCurrentYear?.();

  useEffect(() => {
    if (!id) return;
    void fetchMemberDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchMemberDetails() {
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('applications_with_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching member details:', error);
        setErrorMsg("Impossible de charger la demande d'adhésion.");
        return;
      }
      setMember(data as MembershipApplication);
    } catch (err) {
      console.error('Error fetching member details:', err);
      setErrorMsg("Une erreur est survenue lors du chargement.");
    }
  }

  if (errorMsg) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {errorMsg}
        </div>
      </div>
    );
  }

  if (!member) return <div className="max-w-3xl mx-auto">Loading...</div>;

  // Prix via le hook (aucune constante)
  const membershipPrice = Number(getMembershipPrice?.(member.membershiptype) ?? 0);
  // Si ton hook n’expose pas getLicensePrice, remplace la ligne suivante par: const licensePrice = 0;
  const licensePrice = Number(getLicensePrice?.(member.licensetype) ?? 0);

  const total = membershipPrice + licensePrice;

  const safeUpper = (v?: string | null) => (v ? String(v).toUpperCase() : '');
  const reference =
    `${safeUpper(member.lastname)} ${safeUpper(member.firstname)} ` +
    `ADH${membershipPrice}${licensePrice > 0 ? ` LIC${licensePrice}` : ''}`;

  const copyReference = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-green-700">Informations de paiement</h2>
        </div>

        {/* Référence de paiement */}
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-green-800">Référence à indiquer</h3>
            <button
              onClick={copyReference}
              className="text-green-600 hover:text-green-700 flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm"
              title="Copier la référence"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span className="text-sm">Copier</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-white p-4 rounded-md border border-green-200">
            <code className="text-lg font-mono font-semibold text-green-800">
              {reference}
            </code>
          </div>
          <p className="mt-2 text-sm text-green-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Cette référence est obligatoire pour identifier votre paiement
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Récapitulatif</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p>
                <span className="text-gray-600">Adhérent :</span>{' '}
                {member.firstname} {member.lastname}
              </p>
              <p>
                <span className="text-gray-600">Type d&apos;adhésion :</span>{' '}
                {member.membershiptype} ({membershipPrice}€)
              </p>
              {member.licensetype && member.licensetype !== 'none' && licensePrice > 0 && (
                <p>
                  <span className="text-gray-600">Licence :</span>{' '}
                  {member.licensetype} ({licensePrice}€)
                </p>
              )}
              <p className="font-semibold">
                <span className="text-gray-600">Total à payer :</span>{' '}
                {total}€
              </p>
              {year && (
                <p className="text-xs text-gray-500">
                  Tarifs {year}{' '}
                  {/* adapte si tu veux afficher la logique de renouvellement ici */}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Coordonnées bancaires</h3>
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
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Important :</strong> Merci d&apos;indiquer exactement la référence ci-dessus lors de votre virement 
              pour nous permettre d&apos;identifier votre paiement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
