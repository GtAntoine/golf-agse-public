import React from 'react';
import { useMembershipFormContext } from '../context/MembershipFormContext';
import { LICENSE_TYPES } from '../../../constants';

export function LicenseTypeSelection() {
  const { formData, updateFormData } = useMembershipFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Type de licence *</label>
      <select
        name="licensetype"
        value={formData.licensetype}
        onChange={(e) => updateFormData('licensetype', e.target.value)}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
      >
        {LICENSE_TYPES.map((type) => (
          <option key={type.id} value={type.id}>
            {type.label} - {type.price}€
          </option>
        ))}
      </select>
    </div>
  );
}