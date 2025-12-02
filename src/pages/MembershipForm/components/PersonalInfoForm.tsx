import React from 'react';
import { useMembershipFormContext } from '../context/MembershipFormContext';

export function PersonalInfoForm() {
  const { formData, updateFormData } = useMembershipFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          required
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nom *</label>
        <input
          type="text"
          name="lastname"
          required
          value={formData.lastname}
          onChange={(e) => updateFormData('lastname', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Prénom *</label>
        <input
          type="text"
          name="firstname"
          required
          value={formData.firstname}
          onChange={(e) => updateFormData('firstname', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date de naissance *</label>
        <input
          type="date"
          name="birthdate"
          required
          value={formData.birthdate}
          onChange={(e) => updateFormData('birthdate', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Adresse *</label>
        <input
          type="text"
          name="address"
          required
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Code postal *</label>
        <input
          type="text"
          name="postalcode"
          required
          value={formData.postalcode}
          onChange={(e) => updateFormData('postalcode', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ville *</label>
        <input
          type="text"
          name="city"
          required
          value={formData.city}
          onChange={(e) => updateFormData('city', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contact d'urgence</label>
        <input
          type="text"
          name="emergencycontact"
          value={formData.emergencycontact}
          onChange={(e) => updateFormData('emergencycontact', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Téléphone d'urgence</label>
        <input
          type="tel"
          name="emergencyphone"
          value={formData.emergencyphone}
          onChange={(e) => updateFormData('emergencyphone', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">N° Licence FFG</label>
        <input
          type="text"
          name="ffglicense"
          value={formData.ffglicense}
          onChange={(e) => updateFormData('ffglicense', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Index Golf</label>
        <input
          type="number"
          step="0.1"
          name="golfindex"
          value={formData.golfindex}
          onChange={(e) => updateFormData('golfindex', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
        <input
          type="text"
          name="birthplace"
          value={formData.birthplace}
          onChange={(e) => updateFormData('birthplace', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
    </div>
  );
}