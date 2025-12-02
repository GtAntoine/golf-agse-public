import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Users as UsersIcon, Search, Mail, Key, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  auth_email: string;
  role: string;
  firstname: string | null;
  lastname: string | null;
}

interface EditModal {
  isOpen: boolean;
  user: User | null;
  type: 'email' | 'password' | null;
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState<EditModal>({ isOpen: false, user: null, type: null });
  const [newValue, setNewValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      navigate('/');
    }
  }

  async function fetchUsers() {
    try {
      // Fetch users from auth.users and join with profiles
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          firstname,
          lastname,
          role,
          auth_users!inner (
            email
          )
        `)
        .order('lastname', { ascending: true });

      if (error) throw error;

      // Transform the data to match our User interface
      const transformedUsers = data.map(user => ({
        id: user.id,
        auth_email: user.auth_users.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.auth_email?.toLowerCase().includes(searchLower) ||
      user.firstname?.toLowerCase().includes(searchLower) ||
      user.lastname?.toLowerCase().includes(searchLower)
    );
  });

  const handleUpdateEmail = async () => {
    if (!modal.user) return;
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.admin.updateUserById(
        modal.user.id,
        { email: newValue }
      );

      if (error) throw error;

      // Update local state
      setUsers(users.map(u => 
        u.id === modal.user?.id ? { ...u, auth_email: newValue } : u
      ));

      setSuccess('Email mis à jour avec succès');
      setTimeout(() => {
        setModal({ isOpen: false, user: null, type: null });
        setNewValue('');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!modal.user) return;
    setError(null);
    setSuccess(null);

    if (newValue !== confirmValue) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { error } = await supabase.auth.admin.updateUserById(
        modal.user.id,
        { password: newValue }
      );

      if (error) throw error;

      setSuccess('Mot de passe mis à jour avec succès');
      setTimeout(() => {
        setModal({ isOpen: false, user: null, type: null });
        setNewValue('');
        setConfirmValue('');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <UsersIcon className="h-6 w-6" />
          Gestion des utilisateurs
        </h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setModal({ isOpen: true, user, type: 'email' })}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setModal({ isOpen: true, user, type: 'password' })}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Key className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && modal.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modal.type === 'email' ? 'Modifier l\'email' : 'Modifier le mot de passe'}
              </h3>
              <button
                onClick={() => {
                  setModal({ isOpen: false, user: null, type: null });
                  setNewValue('');
                  setConfirmValue('');
                  setError(null);
                  setSuccess(null);
                }}
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
              {modal.type === 'email' ? (
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
                  onClick={() => {
                    setModal({ isOpen: false, user: null, type: null });
                    setNewValue('');
                    setConfirmValue('');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Annuler
                </button>
                <button
                  onClick={modal.type === 'email' ? handleUpdateEmail : handleUpdatePassword}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}