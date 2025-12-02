import React from 'react';
import { MembershipApplication } from '../../types';
import { Euro, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  application: MembershipApplication;
  type: 'membership' | 'license';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showNextYearWarning?: boolean;
}

export function PaymentModal({ 
  application, 
  type, 
  isOpen, 
  onClose, 
  onConfirm,
  showNextYearWarning = false
}: PaymentModalProps) {
  if (!isOpen) return null;

  const title = type === 'membership' ? 'Adhésion' : 'Licence';
  const isPaid = type === 'membership' ? application.membership_paid : application.license_paid;

  // Déterminer l'année d'adhésion
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const membershipYear = currentMonth >= 8 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <Euro className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold">
            Modification du statut de paiement - {title}
          </h3>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-gray-600">
            {application.firstname} {application.lastname}
          </p>
          <p className="text-gray-600">
            Statut actuel : <span className={isPaid ? 'text-green-600' : 'text-red-600'}>
              {isPaid ? 'Payé' : 'Non payé'}
            </span>
          </p>

          {showNextYearWarning && !isPaid && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Période de renouvellement</p>
                <p>
                  À partir du 1er septembre, le paiement de l'adhésion sera valable pour la fin de l'année en cours 
                  <strong> ET pour toute l'année {membershipYear}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Confirmer le changement
          </button>
        </div>
      </div>
    </div>
  );
}