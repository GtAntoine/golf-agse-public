import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { useUsers } from './hooks/useUsers';
import { SearchBar } from './components/SearchBar';
import { UsersTable } from './components/UsersTable';
import { EditModal } from './components/EditModal';

export default function Users() {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    modal,
    setModal,
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateRole,
    handleDeleteUser
  } = useUsers();

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
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        <UsersTable users={users} onEditUser={setModal} />
      </div>

      <EditModal
        modal={modal}
        onClose={() => setModal({ isOpen: false, user: null, type: null })}
        onUpdateEmail={handleUpdateEmail}
        onUpdatePassword={handleUpdatePassword}
        onUpdateRole={handleUpdateRole}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}