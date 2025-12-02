import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowUpDown, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MembershipApplication, PaymentStatus } from '../../types';

interface ApplicationsTableProps {
  applications: MembershipApplication[];
  paymentStatuses: Record<string, PaymentStatus[]>;
  onSort: (key: keyof MembershipApplication) => void;
  checkFFGLicense: (licenseNumber: string) => void;
}

export function ApplicationsTable({ 
  applications, 
  paymentStatuses,
  onSort, 
  checkFFGLicense 
}: ApplicationsTableProps) {
  const isApplicationValidated = (application: MembershipApplication) => {
    const applicationDate = new Date(application.created_at);
    const applicationYear = applicationDate.getFullYear();
    const applicationMonth = applicationDate.getMonth();
    
    // If application is made from September onwards, it's for the next year
    const membershipYear = applicationMonth >= 8 ? applicationYear + 1 : applicationYear;

    console.log('paymentStatuses', paymentStatuses)
    // Get all payments for this user
    const userPayments = paymentStatuses[application.user_id] || [];
    
    // Find payments for the membership year
    const yearPayments = userPayments.filter(payment => payment.year === membershipYear);
    
    // Check if any payment for this year is validated
    return yearPayments.some(payment => payment.validated);
  };

  const getPaymentStatus = (application: MembershipApplication) => {
    const applicationDate = new Date(application.created_at);
    const applicationYear = applicationDate.getFullYear();
    const applicationMonth = applicationDate.getMonth();
    const membershipYear = applicationMonth >= 8 ? applicationYear + 1 : applicationYear;
    
    const userPayments = paymentStatuses[application.user_id] || [];
    const yearPayments = userPayments.filter(payment => payment.year === membershipYear);
    
    if (yearPayments.length === 0) return false;
    
    return yearPayments.some(payment => 
      payment.membership_paid && payment.license_paid && payment.member_type
    );
  };

  const handleLicenseClick = (application: MembershipApplication) => {
    if (application.ffglicense) {
      navigator.clipboard.writeText(application.ffglicense);
      window.open('https://xnet.ffgolf.org/', '_blank');
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              { key: 'created_at', label: 'Date' },
              { key: 'lastname', label: 'Nom' },
              { key: 'firstname', label: 'Prénom' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Téléphone' },
              { key: 'membershiptype', label: "Type d'adhésion" },
              { key: 'ffglicense', label: 'Licence FFG' }
            ].map(({ key, label }) => (
              <th
                key={key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort(key as keyof MembershipApplication)}
              >
                <div className="flex items-center gap-2">
                  {label}
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application) => {
            const isValidated = isApplicationValidated(application);
            const isComplete = getPaymentStatus(application);

            return (
              <tr 
                key={application.id} 
                className={`hover:bg-gray-50 ${isValidated ? 'bg-green-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(application.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/member/${application.id}`} className="text-sm font-medium text-gray-900 hover:text-green-600">
                    {application.lastname}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {application.firstname}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {application.membershiptype}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {application.ffglicense || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {isComplete && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Complet
                      </span>
                    )}
                    {isValidated ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Traité
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        En attente
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {application.ffglicense && (
                    <button
                      onClick={() => handleLicenseClick(application)}
                      className="text-green-600 hover:text-green-900 flex items-center gap-1"
                    >
                      Vérifier licence <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}