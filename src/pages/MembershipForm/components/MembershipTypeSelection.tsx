import React from 'react';
import { useMembershipFormContext } from '../context/MembershipFormContext';
import { MEMBERSHIP_TYPES } from '../../../constants';

export function MembershipTypeSelection() {
  const { formData, updateFormData } = useMembershipFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Type d'adhésion *</label>
      <div className="grid gap-4 md:grid-cols-3">
        {MEMBERSHIP_TYPES.map((type) => (
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
            <div className="text-sm text-gray-600">{type.description}</div>
            <div className="mt-2 font-semibold">{type.price}€</div>
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