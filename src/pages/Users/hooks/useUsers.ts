import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { User, EditModal } from '../types';

export function useUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState<EditModal>({ isOpen: false, user: null, type: null });

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
      .maybeSingle();

    if (profile?.role !== 'admin') {
      navigate('/');
    }
  }

  async function fetchUsers() {
    try {
      // Récupérer les utilisateurs via la fonction RPC
      const { data: users, error: usersError } = await supabase.rpc('get_users');
      if (usersError) throw usersError;

      // Récupérer les demandes d'adhésion pour chaque utilisateur
      const { data: applications, error: applicationsError } = await supabase
        .from('membership_applications')
        .select('user_id');
      if (applicationsError) throw applicationsError;

      // Créer un Set des IDs des utilisateurs ayant fait une demande
      const usersWithApplications = new Set(applications.map(app => app.user_id));

      // Transformer les données
      const transformedUsers = users.map(user => ({
        id: user.id,
        auth_email: user.email,
        role: user.role || 'user',
        firstname: user.firstname,
        lastname: user.lastname,
        has_membership_application: usersWithApplications.has(user.id)
      }));

      console.log("transformedUsers", transformedUsers)
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

  const handleUpdateEmail = async (newEmail: string) => {
    if (!modal.user) return;

    try {
      const { error } = await supabase.rpc('update_user_email', {
        user_id: modal.user.id,
        new_email: newEmail
      });

      if (error) throw error;

      setUsers(users.map(u => 
        u.id === modal.user?.id ? { ...u, auth_email: newEmail } : u
      ));

      setModal({ isOpen: false, user: null, type: null });
    } catch (error: any) {
      console.error('Error updating email:', error);
      alert('Erreur lors de la mise à jour de l\'email');
    }
  };

  const handleUpdatePassword = async (newPassword: string, confirmPassword: string) => {
    if (!modal.user || newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { error } = await supabase.rpc('update_user_password', {
        user_id: modal.user.id,
        new_password: newPassword
      });

      if (error) throw error;

      setModal({ isOpen: false, user: null, type: null });
    } catch (error: any) {
      console.error('Error updating password:', error);
      alert('Erreur lors de la mise à jour du mot de passe');
    }
  };

  const handleUpdateRole = async (newRole: 'admin' | 'user') => {
    if (!modal.user) return;

    try {
      const { error } = await supabase.rpc('update_user_role', {
        user_id: modal.user.id,
        new_role: newRole
      });

      if (error) throw error;

      setUsers(users.map(u => 
        u.id === modal.user?.id ? { ...u, role: newRole } : u
      ));

      setModal({ isOpen: false, user: null, type: null });
    } catch (error: any) {
      console.error('Error updating role:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDeleteUser = async () => {
    if (!modal.user) return;

    try {
      const { error } = await supabase.rpc('delete_user', {
        p_user_id: modal.user.id
      });

      if (error) throw error;

      setUsers(users.filter(u => u.id !== modal.user?.id));
      setModal({ isOpen: false, user: null, type: null });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    modal,
    setModal,
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateRole,
    handleDeleteUser
  };
}