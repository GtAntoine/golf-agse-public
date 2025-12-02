import React from 'react';
import { Mail, Key, Trash2, UserCog, AlertCircle } from 'lucide-react';
import { User, EditModal } from '../types';

interface UsersTableProps {
  users: User[];
  onEditUser: (modal: EditModal) => void;
}

export function UsersTable({ users, onEditUser }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rôle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.lastname} {user.firstname}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.auth_email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {!user.has_membership_application && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs">Pas de demande d'adhésion</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-8">
                <button
                  onClick={() => onEditUser({ isOpen: true, user, type: 'role' })}
                  className="text-purple-600 hover:text-purple-900"
                  title="Modifier le rôle"
                >
                  <UserCog className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEditUser({ isOpen: true, user, type: 'email' })}
                  className="text-blue-600 hover:text-blue-900"
                  title="Modifier l'email"
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEditUser({ isOpen: true, user, type: 'password' })}
                  className="text-green-600 hover:text-green-900"
                  title="Modifier le mot de passe"
                >
                  <Key className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEditUser({ isOpen: true, user, type: 'delete' })}
                  className="text-red-600 hover:text-red-900 ml-4"
                  title="Supprimer l'utilisateur"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}