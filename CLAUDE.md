# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Golf AGSE membership management application built with React + TypeScript + Vite, using Supabase for backend (authentication, database, RLS). This is a French golf association management system handling member registrations, payments, and administrative tasks.

## Development Commands

**All commands must be run from the `config/` directory:**

```bash
cd config
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm preview      # Preview production build
```

## Architecture

### Authentication & Authorization

- Supabase Auth handles user authentication
- Role-based access control via `profiles.role` ('user' | 'admin')
- `PrivateRoute` component wraps protected routes and checks both authentication and admin status
- Admin routes require `requireAdmin` prop on `PrivateRoute`
- User profile automatically created via database trigger (`handle_new_user`) on registration

### Key Database Tables

- `profiles` - User profiles (created automatically on auth.users insert)
- `membership_applications` - Membership registration data
- `payment_history` - Payment status tracking per year with fields: `membership_paid`, `license_paid`, `member_type`, `validated`
- Migrations in `supabase/migrations/` directory

### Application Flow

1. **Member Registration Flow**: User completes membership form → Data saved to `membership_applications` → Payment tracked in `payment_history`
2. **Yearly Cycle**: Membership year runs Sept 1 → Aug 31 (next calendar year). Application created in Sept+ targets next year
3. **Admin Workflow**: Admins validate applications, update payment status, change member types (AGSE/RATTACHE)

### State Management Patterns

- **Context-based forms**: `MembershipFormContext` provides form state across multi-step forms
- **Custom hooks**: Logic extracted to hooks (e.g., `useMembershipForm`, `useProfile`, `useUsers`)
- **Auto-loading profiles**: Forms pre-populate from `profiles` table via context `useEffect`

### Page Organization

Pages use a modular structure:
```
pages/
  PageName/
    index.tsx              # Main component
    components/            # Page-specific components
    hooks/                 # Page-specific hooks
    context/              # Page-specific context (if needed)
    types.ts              # Page-specific types
```

Legacy `.ori.tsx` files are old monolithic versions kept for reference.

### Component Patterns

- Admin components in `components/admin/` (e.g., `ApplicationsTable`, `PaymentModal`, `ValidationModal`)
- Member components in `components/member/` (profile editing, payment status)
- Shared membership components in `components/membership/` (type selection, pricing)
- All modals use controlled state pattern with boolean flags

### Types System

- Central types in `src/types.ts`
- Page-specific types in page directories
- Constants for membership/license types in `src/constants.ts`
- Key types: `MembershipApplication`, `PaymentStatus`, `Profile`, `AuditLog`

### Supabase Integration

- Client initialized in `src/supabaseClient.ts` using env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- RLS policies enforce data access control
- Admin functions use RPC calls (e.g., `get_users`)
- Real-time auth state changes handled via `supabase.auth.onAuthStateChange()`

### Data Export

`src/utils/exportData.ts` handles CSV/Excel exports using `xlsx` library. Exports combine application data with payment status, calculating the correct year based on application date (Sept+ = next year).

## Configuration Notes

- Vite config in `config/vite.config.ts`
- TypeScript configs in `config/tsconfig.*.json`
- TailwindCSS for styling (config in `config/tailwind.config.js`)
- `lucide-react` excluded from optimization in Vite config
