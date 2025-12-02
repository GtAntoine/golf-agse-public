import React from 'react';
import { useMembershipFormContext } from '../../pages/MembershipForm/context/MembershipFormContext';
import { useMembershipPrices } from '../../hooks/useMembershipPrices';

const MEMBERSHIP_DESCRIPTIONS = {
  GOLF: 'Sorties en groupes sur parcours 18T : Prix négociés avec les Golfs',
  GOLF_LOISIR: 'Initiation au golf et Sorties en groupes sur parcours 9T et aussi 18T: Prix négociés avec les Golfs',
  GOLF_JEUNE: 'Initiation et Leçons de golf pour les jeunes de moins de 25 ans'
};

export function MembershipTypeSelection() {
  const { formData, updateFormData } = useMembershipFormContext();
  const { getMembershipPrice, getCurrentYear } = useMembershipPrices();
  const year = getCurrentYear();

  // Déterminer si on est en période de renouvellement
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const isRenewalPeriod = currentMonth >= 8; // septembre ou après

  const membershipTypes = [
    { id: 'GOLF', label: 'GOLF' },
    { id: 'GOLF_LOISIR', label: 'GOLF LOISIR' },
    { id: 'GOLF_JEUNE', label: 'GOLF JEUNE' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Type d'adhésion *</label>
      <div className="grid gap-4 md:grid-cols-3">
        {membershipTypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              formData.membershiptype === type.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
            onClick={() => updateFormData('membershiptype', type.id)}
          >
            <div className="font-medium">{type.label}</div>
            <div className="text-sm text-gray-600 mb-2">{MEMBERSHIP_DESCRIPTIONS[type.id]}</div>
            <div className="mt-2 font-semibold">{getMembershipPrice(type.id)}€</div>
            <div className="text-xs text-gray-500 mt-1">
              {isRenewalPeriod ? (
                <span className="text-blue-600 font-medium">
                  Tarif {year - 1} (valable jusqu'à fin {year})
                </span>
              ) : (
                `Tarif ${year}`
              )}
            </div>
            <input
              type="radio"
              name="membershiptype"
              value={type.id}
              checked={formData.membershiptype === type.id}
              onChange={() => updateFormData('membershiptype', type.id)}
              className="sr-only"
            />
          </div>
        ))}
      </div>
    </div>
  );
}