import { MembershipApplication, PaymentStatus } from '../types';
import * as XLSX from 'xlsx';

function formatData(applications: MembershipApplication[], paymentStatuses: Record<string, PaymentStatus[]>) {
  return applications.map(app => {
    // Get payment status for the current application year
    const applicationDate = new Date(app.created_at);
    const applicationYear = applicationDate.getMonth() >= 8 ? 
      applicationDate.getFullYear() + 1 : 
      applicationDate.getFullYear();

    const userPayments = paymentStatuses[app.user_id] || [];
    const paymentStatus = userPayments.find(p => p.year === applicationYear);

    return {
      'Prénom': app.firstname || '',
      'Email': app.email || '',
      'Téléphone': app.phone || '',
      'Date de naissance': app.birthdate || '',
      'Adresse': app.address || '',
      'Code postal': app.postalcode || '',
      'Ville': app.city || '',
      'Contact urgence': app.emergencycontact || '',
      'Téléphone urgence': app.emergencyphone || '',
      'Licence FFG': app.ffglicense || '',
      'Index Golf': app.golfindex || '',
      'Lieu de naissance': app.birthplace || '',
      'Type adhésion': app.membershiptype || '',
      'Type licence': app.licensetype || '',
      'Adhésion payée': paymentStatus?.membership_paid ? 'Oui' : 'Non',
      'Licence payée': paymentStatus?.license_paid ? 'Oui' : 'Non',
      'Statut membre': paymentStatus?.member_type || '-',
      'Traité': paymentStatus?.validated ? 'Oui' : 'Non',
      'Rôle': app.role || 'user',
      'Date création': app.created_at ? new Date(app.created_at).toLocaleDateString('fr-FR') : ''
    };
  });
}

export function exportToCSV(applications: MembershipApplication[], paymentStatuses: Record<string, PaymentStatus[]>) {
  const data = formatData(applications, paymentStatuses);
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => 
      `"${(row as any)[header]?.toString().replace(/"/g, '""') || ''}"` // Escape quotes and handle null values
    ).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel UTF-8
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `membres_agse_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

export function exportToExcel(applications: MembershipApplication[], paymentStatuses: Record<string, PaymentStatus[]>) {
  const data = formatData(applications, paymentStatuses);
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: Object.keys(data[0]),
    dateNF: 'dd/mm/yyyy'
  });

  // Ajuster la largeur des colonnes
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => ((row as any)[key]?.toString() || '').length)
    )
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Membres');
  XLSX.writeFile(workbook, `membres_agse_${new Date().toISOString().split('T')[0]}.xlsx`);
}