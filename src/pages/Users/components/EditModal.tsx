import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Trash2, UserCog } from 'lucide-react';
import { EditModal as EditModalType } from '../types';

interface EditModalProps {
  modal: EditModalType;
  onClose: () => void;
  onUpdateEmail: (newEmail: string) => Promise<void>;
  onUpdatePassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  onUpdateRole: (newRole: 'admin' | 'user') => Promise<void>;
  onDeleteUser: () => Promise<void>;
}

export function EditModal({ 
  modal, 
  onClose, 
  onUpdateEmail, 
  onUpdatePassword,
  onUpdateRole,
  onDeleteUser 
}: EditModalProps) {
  const [newValue, setNewValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!modal.isOpen || !modal.user) return null;

  const handleSubmit = async () => {
    if (modal.type === 'email') {
      await onUpdateEmail(newValue);
    } else if (modal.type === 'password') {
      await onUpdatePassword(newValue, confirmValue);
    } else if (modal.type === 'role') {
      if (newValue !== 'admin' && newValue !== 'user') {
        setError('Rôle invalide');
        return;
      }
      await onUpdateRole(newValue);
    } else if (modal.type === 'delete') {
      await onDeleteUser();
    }
  };

  const handleClose = () => {
    setNewValue('');
    setConfirmValue('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {modal.type === 'delete' && <Trash2 className="h-5 w-5 text-red-600" />}
            {modal.type === 'role' && <UserCog className="h-5 w-5 text-purple-600" />}
            {modal.type === 'email' ? 'Modifier l\'email' : 
             modal.type === 'password' ? 'Modifier le mot de passe' :
             modal.type === 'role' ? 'Modifier le rôle' :
             'Supprimer l\'utilisateur'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            {success}
          </div>
        )}

        <div className="space-y-4">
          {modal.type === 'delete' ? (
            <div className="text-gray-700">
              <p className="mb-4">
                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{modal.user.firstname} {modal.user.lastname}</strong> ?
              </p>
              <p className="text-sm text-red-600 bg-red-50 p-4 rounded-md">
                Cette action est irréversible. Toutes les données associées à cet utilisateur seront supprimées.
              </p>
            </div>
          ) : modal.type === 'role' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rôle
              </label>
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Sélectionner un rôle</option>
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          ) : modal.type === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nouvel email
              </label>
              <input
                type="email"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmValue}
                  onChange={(e) => setConfirmValue(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 ${
                modal.type === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-md`}
            >
              {modal.type === 'delete' ? 'Supprimer' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}