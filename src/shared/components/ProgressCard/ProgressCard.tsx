'use client';

import React from 'react';

interface ProgressCardProps {
  percentage: number;
  label?: string;
  showLabel?: boolean;
}

export function ProgressCard({ percentage, label = 'Completado', showLabel = true }: ProgressCardProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className={showLabel ? 'bg-white rounded-lg border border-slate-200 p-6 shadow-sm' : ''}>
      <div className={showLabel ? 'space-y-3' : ''}>
        {showLabel && <h2 className="text-lg font-semibold text-slate-900">{label}</h2>}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <svg className="w-20 h-20" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#C1232B"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-300"
              />
              <text
                x="50"
                y="55"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#0F172A"
              >
                {percentage}%
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
