// User Profile Types
export interface Profile {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  birthdate: string | null;
  phone: string | null;
  address: string | null;
  postalcode: string | null;
  city: string | null;
  ffglicense: string | null;
  birthplace: string | null;
  created_at: string;
  updated_at: string;
}

// Membership Types
export type MembershipType = 'GOLF' | 'GOLF_LOISIR' | 'GOLF_JEUNE';
export type LicenseType = 'adult' | 'young-adult' | 'teen' | 'child' | 'none';
export type MemberType = 'RATTACHE' | 'AGSE';

export interface MembershipApplication {
  id: string;
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  postalcode: string;
  city: string;
  birthdate: string;
  phone: string;
  emergencycontact: string | null;
  emergencyphone: string | null;
  membershiptype: MembershipType;
  ffglicense: string | null;
  golfindex: number | null;
  birthplace: string | null;
  licensetype: LicenseType;
  created_at: string;
  role: string; // Added role field to match the database schema
}

// Payment Types
export interface PaymentHistory {
  id: string;
  profile_id: string;
  year: number;
  membership_paid: boolean;
  license_paid: boolean;
  member_type: MemberType | null;
  validated: boolean;
  validated_at: string | null;
  created_at: string;
}

export interface PaymentStatus {
  profile_id: string;
  membership_paid: boolean;
  license_paid: boolean;
  member_type: MemberType | null;
  validated: boolean;
  year: number;
}

// Audit Log Types
export type ChangeType = 
  | 'MEMBERSHIP_PAYMENT' 
  | 'LICENSE_PAYMENT' 
  | 'MEMBER_TYPE' 
  | 'PERSONAL_INFO'
  | 'VALIDATION_STATUS';

export interface AuditLog {
  id: string;
  user_id: string;
  year: number;
  change_type: ChangeType;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  created_by: string | null;
}

// Membership Fee Types
export interface MembershipFee {
  id: string;
  label: string;
  description: string;
  price: number;
}

export interface LicenseFee {
  id: LicenseType;
  label: string;
  price: number;
}