import React from 'react';
import { UserCircle, Save } from 'lucide-react';
import { useProfile } from './hooks/useProfile';
import { ProfileForm } from './components/ProfileForm';
import { StatusMessage } from './components/StatusMessage';

export default function Profile() {
  const { profile, loading, message, handleSubmit, handleChange } = useProfile();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserCircle className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        </div>

        {message && <StatusMessage type={message.type} text={message.text} />}

        <form onSubmit={handleSubmit}>
          <ProfileForm profile={profile} onChange={handleChange} />

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}