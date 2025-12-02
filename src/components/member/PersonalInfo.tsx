import React, { useState } from 'react';
import { MembershipApplication } from '../../types';
import { Pencil } from 'lucide-react';
import { EditPersonalInfo } from './EditPersonalInfo';
import { supabase } from '../../supabaseClient';

interface PersonalInfoProps {
  member: MembershipApplication;
  onUpdate: () => void;
}

export function PersonalInfo({ member, onUpdate }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async (updatedMember: Partial<MembershipApplication>) => {
    try {
      setIsUpdating(true);

      // Vérifier que l'ID utilisateur est disponible
      if (!member.user_id) {
        throw new Error('ID utilisateur non disponible');
      }

      // Mise à jour du profil
      const { error } = await supabase
        .from('profiles')
        .update({
          firstname: updatedMember.firstname,
          lastname: updatedMember.lastname,
          birthdate: updatedMember.birthdate,
          phone: updatedMember.phone || null,
          address: updatedMember.address || null,
          postalcode: updatedMember.postalcode || null,
          city: updatedMember.city || null,
          ffglicense: updatedMember.ffglicense || null,
          emergencycontact: updatedMember.emergencycontact || null,
          emergencyphone: updatedMember.emergencyphone || null,
          golfindex: updatedMember.golfindex ? Number(updatedMember.golfindex) : null,
          birthplace: updatedMember.birthplace || null,
          role: updatedMember.role || 'user',
          updated_at: new Date().toISOString()
        })
        .eq('id', member.user_id);

      if (error) {
        console.error('Erreur de mise à jour:', error);
        throw error;
      }

      // Attendre que la vue matérialisée soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsEditing(false);
      await onUpdate();
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Une erreur est survenue lors de la mise à jour des informations.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <EditPersonalInfo
        member={member}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Informations personnelles</h3>
        <button
          onClick={() => setIsEditing(true)}
          disabled={isUpdating}
          className="text-green-600 hover:text-green-700 flex items-center gap-2 disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" />
          Modifier
        </button>
      </div>
      
      <dl className="space-y-2">
        <div>
          <dt className="text-sm text-gray-500">Email</dt>
          <dd className="text-gray-900">{member.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Rôle</dt>
          <dd className="text-gray-900 capitalize">{member.role || 'user'}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Date de naissance</dt>
          <dd className="text-gray-900">{formatDate(member.birthdate)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Téléphone</dt>
          <dd className="text-gray-900">{member.phone}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Adresse</dt>
          <dd className="text-gray-900">
            {member.address}<br />
            {member.postalcode} {member.city}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Lieu de naissance</dt>
          <dd className="text-gray-900">{member.birthplace}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Type d'adhésion</dt>
          <dd className="text-gray-900">{member.membershiptype}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Licence FFG</dt>
          <dd className="text-gray-900">{member.ffglicense || '-'}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Index Golf</dt>
          <dd className="text-gray-900">{member.golfindex ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Contact d'urgence</dt>
          <dd className="text-gray-900">
            {member.emergencycontact ? (
              <>
                {member.emergencycontact}
                {member.emergencyphone && (
                  <span className="text-gray-500 ml-2">
                    (Tél: {member.emergencyphone})
                  </span>
                )}
              </>
            ) : (
              '-'
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}