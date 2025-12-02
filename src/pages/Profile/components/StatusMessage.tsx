import React from 'react';
import { AlertCircle } from 'lucide-react';

interface StatusMessageProps {
  type: 'success' | 'error';
  text: string;
}

export function StatusMessage({ type, text }: StatusMessageProps) {
  return (
    <div className={`mb-4 p-4 rounded-md flex items-center gap-2 ${
      type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p>{text}</p>
    </div>
  );
}