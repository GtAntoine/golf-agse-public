import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MembershipApplication } from '../../types';

interface MemberHeaderProps {
  member: MembershipApplication;
}

export function MemberHeader({ member }: MemberHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link to="/admin" className="text-green-600 hover:text-green-700 flex items-center gap-2">
        <ArrowLeft className="h-5 w-5" />
        Retour
      </Link>
      <h2 className="text-2xl font-bold text-green-700">
        {member.firstname} {member.lastname}
      </h2>
    </div>
  );
}