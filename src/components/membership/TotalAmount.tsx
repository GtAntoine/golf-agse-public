import React from 'react';
import { useMembershipFormContext } from '../../pages/MembershipForm/context/MembershipFormContext';
import { useMembershipPrices } from '../../hooks/useMembershipPrices';

export function TotalAmount() {
  const { formData } = useMembershipFormContext();
  const { getMembershipPrice, getLicensePrice, getCurrentYear } = useMembershipPrices();
  const year = getCurrentYear();

  const membershipPrice = getMembershipPrice(formData.membershiptype);
  const licensePrice = formData.licensetype === 'none' ? 0 : getLicensePrice(formData.licensetype);
  const totalPrice = membershipPrice + licensePrice;

  return (
    <div className="border-t pt-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Adhésion {year} ({formData.membershiptype})</span>
          <span>{membershipPrice}€</span>
        </div>
        {formData.licensetype !== 'none' && (
          <div className="flex justify-between text-sm">
            <span>Licence FFG {year}</span>
            <span>{licensePrice}€</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-semibold text-green-700 pt-2">
          <span>Total à payer</span>
          <span>{totalPrice}€</span>
        </div>
      </div>
    </div>
  );
}