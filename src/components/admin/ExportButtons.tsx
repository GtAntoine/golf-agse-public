import React from 'react';
import { FileSpreadsheet, FileDown } from 'lucide-react';
import { MembershipApplication, PaymentStatus } from '../../types';
import { exportToCSV, exportToExcel } from '../../utils/exportData';

interface ExportButtonsProps {
  applications: MembershipApplication[];
  paymentStatuses: Record<string, PaymentStatus[]>;
}

export function ExportButtons({ applications, paymentStatuses }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToCSV(applications, paymentStatuses)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <FileDown className="h-4 w-4" />
        Exporter CSV
      </button>
      <button
        onClick={() => exportToExcel(applications, paymentStatuses)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Exporter Excel
      </button>
    </div>
  );
}