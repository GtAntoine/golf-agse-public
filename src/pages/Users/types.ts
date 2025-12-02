export interface User {
  id: string;
  auth_email: string;
  role: string;
  firstname: string | null;
  lastname: string | null;
  has_membership_application: boolean;
}

export interface EditModal {
  isOpen: boolean;
  user: User | null;
  type: 'email' | 'password' | 'delete' | 'role' | null;
}