import React from 'react';
import { ProfileData } from '../types';

interface ProfileFormProps {
  profile: ProfileData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileForm({ profile, onChange }: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={profile.email}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
            Prénom *
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={profile.firstname}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
            Nom *
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            required
            value={profile.lastname}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
            Date de naissance *
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            required
            value={profile.birthdate}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={profile.phone}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Adresse *
        </label> 
        <input
          type="text"
          id="address"
          name="address"
          required
          value={profile.address}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalcode" className="block text-sm font-medium text-gray-700">
            Code postal *
          </label>
          <input
            type="text"
            id="postalcode"
            name="postalcode"
            required
            value={profile.postalcode}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ville *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={profile.city}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="emergencycontact" className="block text-sm font-medium text-gray-700">
            Contact d'urgence
          </label>
          <input
            type="text"
            id="emergencycontact"
            name="emergencycontact"
            value={profile.emergencycontact}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="emergencyphone" className="block text-sm font-medium text-gray-700">
            Téléphone d'urgence
          </label>
          <input
            type="tel"
            id="emergencyphone"
            name="emergencyphone"
            value={profile.emergencyphone}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ffglicense" className="block text-sm font-medium text-gray-700">
            Numéro de licence FFG
          </label>
          <input
            type="text"
            id="ffglicense"
            name="ffglicense"
            value={profile.ffglicense}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="golfindex" className="block text-sm font-medium text-gray-700">
            Index Golf
          </label>
          <input
            type="number"
            step="0.1"
            id="golfindex"
            name="golfindex"
            value={profile.golfindex || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

         <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
           Lieu de naissance
          </label>
          <input
            type="text"
            id="birthplace"
            name="birthplace"
            value={profile.birthplace}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

      </div>
    </div>
  );
}