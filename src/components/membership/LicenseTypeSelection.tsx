import React from 'react';
import { useMembershipFormContext } from '../../pages/MembershipForm/context/MembershipFormContext';
import { useMembershipPrices } from '../../hooks/useMembershipPrices';

const LICENSE_LABELS = {
  'adult': 'Licence FFG Adulte',
  'young-adult': 'Licence FFG Jeune adulte (19-25 ans)',
  'teen': 'Licence FFG Jeune (13-18 ans)',
  'child': 'Licence FFG Enfant (moins de 13 ans)',
  'none': "Pas de Licence FFG demandée via l'AGSE Golf"
};

export function LicenseTypeSelection() {
  const { formData, updateFormData } = useMembershipFormContext();
  const { getLicensePrice, getCurrentYear } = useMembershipPrices();
  const year = getCurrentYear();

  // Déterminer si on est en période de renouvellement
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const isRenewalPeriod = currentMonth >= 8; // septembre ou après

  const licenseTypes = [
    'adult',
    'young-adult',
    'teen',
    'child',
    'none'
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Type de licence *</label>
      <div className="space-y-2">
        {licenseTypes.map((type) => (
          <div
            key={type}
            className={`p-4 border rounded-lg cursor-pointer ${
              formData.licensetype === type
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
            onClick={() => updateFormData('licensetype', type)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{LICENSE_LABELS[type]}</div>
                {type !== 'none' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {isRenewalPeriod ? (
                      <span className="text-blue-600 font-medium">
                        Tarif {year - 1} (valable jusqu'à fin {year})
                      </span>
                    ) : (
                      `Tarif ${year}`
                    )}
                  </div>
                )}
              </div>
              {type !== 'none' && (
                <div className="font-semibold">{getLicensePrice(type)}€</div>
              )}
            </div>
            <input
              type="radio"
              name="licensetype"
              value={type}
              checked={formData.licensetype === type}
              onChange={() => updateFormData('licensetype', type)}
              className="sr-only"
            />
          </div>
        ))}
      </div>
    </div>
  );
}