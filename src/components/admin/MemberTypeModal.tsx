import React from 'react';
import { MembershipApplication, MemberType } from '../../types';
import { UserCheck } from 'lucide-react';

interface MemberTypeModalProps {
  application: MembershipApplication;
  memberType: MemberType;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function MemberTypeModal({ application, memberType, isOpen, onClose, onConfirm }: MemberTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold">
            Modification du statut - {memberType}
          </h3>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-gray-600">
            {application.firstname} {application.lastname}
          </p>
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir définir le statut à {memberType} ?
          </p>
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
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}