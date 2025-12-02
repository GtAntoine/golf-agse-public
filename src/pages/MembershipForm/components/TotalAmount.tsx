import React from 'react';
import { useMembershipFormContext } from '../context/MembershipFormContext';
import { MEMBERSHIP_TYPES, LICENSE_TYPES } from '../../../constants';

export function TotalAmount() {
  const { formData } = useMembershipFormContext();

  const selectedMembership = MEMBERSHIP_TYPES.find(type => type.id === formData.membershiptype);
  const selectedLicense = LICENSE_TYPES.find(type => type.id === formData.licensetype);
  const totalPrice = (selectedMembership?.price || 0) + (selectedLicense?.price || 0);

  return (
    <div className="border-t pt-4">
      <div className="text-xl font-semibold text-green-700">
        Total à payer: {totalPrice}€
      </div>
    </div>
  );
}