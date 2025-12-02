import React from 'react';
import { BadgeCheck, AlertCircle } from 'lucide-react';

interface ValidationModalProps {
  isOpen: boolean;
  year: number;
  isValidating: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ValidationModal({ 
  isOpen, 
  year, 
  isValidating,
  onClose, 
  onConfirm 
}: ValidationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          {isValidating ? (
            <BadgeCheck className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-amber-600" />
          )}
          <h3 className="text-lg font-semibold">
            {isValidating ? 'Marquer comme traité' : 'Annuler le traitement'}
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {isValidating 
              ? `Êtes-vous sûr de vouloir marquer l'année ${year} comme traitée ?`
              : `Êtes-vous sûr de vouloir annuler le traitement de l'année ${year} ?`
            }
          </p>
          {isValidating && (
            <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Cette action indique que vous avez vérifié et validé tous les documents nécessaires.
            </p>
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
            className={`px-4 py-2 text-white rounded-md ${
              isValidating 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}