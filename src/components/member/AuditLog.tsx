import React from 'react';
import { History } from 'lucide-react';
import { AuditLog as AuditLogType } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuditLogProps {
  logs: AuditLogType[];
}

function getChangeDescription(log: AuditLogType): { title: string; changes: string } {
  switch (log.change_type) {
    case 'MEMBERSHIP_PAYMENT':
      return {
        title: 'Adhésion',
        changes: `${log.old_value === 'true' ? 'payée' : 'non payée'} -> ${log.new_value === 'true' ? 'payée' : 'non payée'}`
      };
    case 'LICENSE_PAYMENT':
      return {
        title: 'Licence',
        changes: `${log.old_value === 'true' ? 'payée' : 'non payée'} -> ${log.new_value === 'true' ? 'payée' : 'non payée'}`
      };
    case 'MEMBER_TYPE':
      return {
        title: 'Statut',
        changes: `${log.old_value || 'Non défini'} -> ${log.new_value}`
      };
    case 'PERSONAL_INFO':
      const oldValues = log.old_value ? JSON.parse(log.old_value) : {};
      const newValues = log.new_value ? JSON.parse(log.new_value) : {};
      const changes = Object.entries(newValues)
        .filter(([key, value]) => value !== oldValues[key])
        .map(([key, value]) => {
          const fieldNames: Record<string, string> = {
            email: 'Email',
            firstname: 'Prénom',
            lastname: 'Nom',
            address: 'Adresse',
            postalcode: 'Code postal',
            city: 'Ville',
            phone: 'Téléphone',
            emergencycontact: "Contact d'urgence",
            emergencyphone: "Téléphone d'urgence",
            ffglicense: 'Licence FFG',
            golfindex: 'Index Golf',
            birthplace: 'Place of Birth',
          };
          return `${fieldNames[key]}: ${oldValues[key]} -> ${value}`;
        })
        .join('\n');
      return {
        title: 'Informations personnelles',
        changes
      };
    default:
      return {
        title: 'Modification',
        changes: ''
      };
  }
}

export function AuditLog({ logs }: AuditLogProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-gray-400" />
        Historique des modifications
      </h3>
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Année
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modifications
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => {
              const { title, changes } = getChangeDescription(log);
              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {title}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {log.year}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <div className="whitespace-pre-line">
                      {changes}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}