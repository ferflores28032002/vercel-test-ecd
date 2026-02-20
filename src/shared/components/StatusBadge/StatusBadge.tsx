'use client';

import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Zap } from 'lucide-react';

export type StatusType = 'pending' | 'in-progress' | 'error' | 'send';

interface StatusBadgeProps {
  status: StatusType;
  tooltip?: string;
}

const statusConfig: Record<StatusType, { bg: string; text: string; icon: React.ReactNode; label: string; bgHover: string }> = {
  pending: {
    bg: 'bg-amber-50 border border-amber-200',
    bgHover: 'hover:bg-amber-100',
    text: 'text-amber-700',
    icon: <Clock className="w-4 h-4" />,
    label: 'Pendiente',
  },
  'in-progress': {
    bg: 'bg-blue-50 border border-blue-200',
    bgHover: 'hover:bg-blue-100',
    text: 'text-blue-700',
    icon: <Zap className="w-4 h-4" />,
    label: 'En Progreso',
  },
  error: {
    bg: 'bg-red-50 border border-red-200',
    bgHover: 'hover:bg-red-100',
    text: 'text-red-700',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Error',
  },
  send: {
    bg: 'bg-green-50 border border-green-200',
    bgHover: 'hover:bg-green-100',
    text: 'text-green-700',
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Enviado',
  },
};

export function StatusBadge({ status, tooltip }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className="relative group inline-flex">
      <div
        className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-xs transition-colors ${config.bg} ${config.text} ${config.bgHover} cursor-help`}
        title={tooltip}
      >
        {config.icon}
        <span className="hidden sm:inline">{config.label}</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
          <div className="bg-slate-900 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-lg">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
}
