import React, { useState } from 'react';
import { Calendar, CheckCircle2, AlertCircle, BadgeCheck } from 'lucide-react';
import { PaymentHistory, MemberType } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ValidationModal } from '../admin/ValidationModal';

interface PaymentStatusProps {
  currentYear: number;
  paymentHistory: PaymentHistory[];
  onPaymentUpdate: (year: number, type: 'membership' | 'license') => void;
  onMemberTypeUpdate: (year: number, type: MemberType | null) => void;
  onValidate: (year: number, validated: boolean) => void;
}

export function PaymentStatus({ 
  currentYear, 
  paymentHistory, 
  onPaymentUpdate, 
  onMemberTypeUpdate,
  onValidate
}: PaymentStatusProps) {
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean;
    year: number;
    isValidating: boolean;
  } | null>(null);

  const nextYear = Math.max(
    currentYear + 1,
    ...paymentHistory.map(p => p.year)
  );

  const yearsToDisplay = Array.from(
    { length: nextYear - currentYear + 3 },
    (_, i) => nextYear - i
  );

  const isYearValidated = (year: number) => {
    const yearPayment = paymentHistory.find(p => p.year === year);
    return yearPayment?.validated;
  };

  const handleValidationClick = (year: number, currentValidation: boolean) => {
    setValidationModal({
      isOpen: true,
      year,
      isValidating: !currentValidation
    });
  };

  const handleValidationConfirm = () => {
    if (validationModal) {
      onValidate(validationModal.year, validationModal.isValidating);
      setValidationModal(null);
    }
  };

  const handleMemberTypeClick = (year: number, type: MemberType) => {
    const yearPayment = paymentHistory.find(p => p.year === year);
    // If the type is already selected, set it to null (deselect)
    // Otherwise, set it to the new type
    const newType = yearPayment?.member_type === type ? null : type;
    onMemberTypeUpdate(year, newType);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Historique des paiements</h3>
      <div className="space-y-4">
        {yearsToDisplay.map(year => {
          const yearPayment = paymentHistory.find(p => p.year === year);
          const isValidated = isYearValidated(year);
          
          return (
            <div key={year} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{year}</span>
                  {year > currentYear && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Année suivante
                    </span>
                  )}
                  {isValidated && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <BadgeCheck className="h-4 w-4" />
                      Traité
                    </span>
                  )}
                </div>
                {yearPayment && (
                  <span className="text-sm text-gray-500">
                    Mis à jour le {format(new Date(yearPayment.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <button
                    onClick={() => onPaymentUpdate(year, 'membership')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      yearPayment?.membership_paid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Adhésion {yearPayment?.membership_paid ? 'payée' : 'non payée'}
                  </button>
                  <button
                    onClick={() => onPaymentUpdate(year, 'license')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      yearPayment?.license_paid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Licence {yearPayment?.license_paid ? 'payée' : 'non payée'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMemberTypeClick(year, 'RATTACHE')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      yearPayment?.member_type === 'RATTACHE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Rattaché
                  </button>
                  <button
                    onClick={() => handleMemberTypeClick(year, 'AGSE')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      yearPayment?.member_type === 'AGSE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    AGSE
                  </button>
                </div>
                {yearPayment?.membership_paid && (
                  <div className="flex items-center gap-2 mt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isValidated}
                        onChange={() => handleValidationClick(year, !!isValidated)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      Marquer comme traité
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {validationModal && (
        <ValidationModal
          isOpen={validationModal.isOpen}
          year={validationModal.year}
          isValidating={validationModal.isValidating}
          onClose={() => setValidationModal(null)}
          onConfirm={handleValidationConfirm}
        />
      )}
    </div>
  );
}