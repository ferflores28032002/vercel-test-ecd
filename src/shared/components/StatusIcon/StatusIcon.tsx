'use client';

import React from 'react';
import { Check, Clock, X, Zap, Info } from 'lucide-react';

export type StatusType = 'success' | 'pending' | 'error' | 'in-progress';

interface StatusIconProps {
  status: StatusType;
  tooltip: string;
}

export function StatusIcon({ status, tooltip }: StatusIconProps) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="flex items-center gap-1">
            <Check className="w-5 h-5 text-[#16A34A] font-bold transition-transform hover:scale-110" strokeWidth={3} />
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1">
            <Clock className="w-5 h-5 text-[#EA8C00] transition-transform hover:scale-110" />
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1">
            <X className="w-5 h-5 text-[#DC2626] font-bold transition-transform hover:scale-110" strokeWidth={3} />
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center gap-1">
            <Zap className="w-5 h-5 text-[#0EA5E9] transition-transform hover:scale-110" />
          </div>
        );
      default:
        return <Info className="w-5 h-5 text-slate-400 transition-transform hover:scale-110" />;
    }
  };

  return (
    <div className="relative inline-flex group cursor-help">
      {getIcon()}
      {/* Tooltip - Professional Dark Bubble */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none shadow-lg">
        {tooltip}
        <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
}
