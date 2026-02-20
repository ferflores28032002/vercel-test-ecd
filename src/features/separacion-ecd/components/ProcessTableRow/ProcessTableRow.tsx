'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SubcuentaData } from '@/types/process';
import { StatusIcon } from '@/shared/components/StatusIcon/StatusIcon';
import { getStatusTooltip } from '../../utils/helpers';
import { procesColumns } from '../../models/mockData';

interface ProcessTableRowProps {
  subcuenta: SubcuentaData;
  isSelected: boolean;
  onToggleExpand: (id: string) => void;
  onSelectChange: (id: string) => void;
}

export function ProcessTableRow({
  subcuenta,
  isSelected,
  onToggleExpand,
  onSelectChange,
}: ProcessTableRowProps) {
  return (
    <>
      {/* Main Row */}
      <tr
        className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${
          isSelected ? 'bg-red-50' : ''
        }`}
      >
        {/* Expand chevron - Sticky col 1 */}
        <td className="w-8 px-2 py-3 sticky left-0 z-10 bg-white">
          <button
            onClick={() => onToggleExpand(subcuenta.id)}
            className={`p-1 rounded hover:bg-slate-200 transition-colors ${
              !subcuenta.isExpanded ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                subcuenta.isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </td>

        {/* Checkbox - Sticky col 2 */}
        <td className="w-10 px-2 py-3 sticky left-8 z-10 bg-white">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectChange(subcuenta.id)}
            className="w-4 h-4 rounded border-slate-300 cursor-pointer"
          />
        </td>

        {/* Subcuenta Code - Sticky col 3 */}
        <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap sticky left-[72px] z-10 bg-white min-w-[140px]">
          {subcuenta.code}
        </td>

        {/* Status Columns - Icons Only */}
        {procesColumns.map((column) => {
          const colData = subcuenta.columns[column.id];
          const hasDoubleStatus = colData?.status2 !== undefined;
          return (
            <td key={column.id} className="px-4 py-3 text-center min-w-[110px]">
              <div className="flex items-center justify-center gap-1.5">
                <StatusIcon
                  status={colData?.status || 'pending'}
                  tooltip={getStatusTooltip(colData?.status || 'pending')}
                />
                {hasDoubleStatus && (
                  <StatusIcon
                    status={colData.status2!}
                    tooltip={getStatusTooltip(colData.status2!)}
                  />
                )}
              </div>
            </td>
          );
        })}
      </tr>

      {/* Expanded Client Rows */}
      {subcuenta.isExpanded && subcuenta.clients?.map((client) => (
        <tr
          key={client.id}
          className="border-b border-slate-100 transition-colors bg-gray-100 hover:bg-gray-200/60"
        >
          {/* Empty space for chevron + checkbox columns - Sticky col 1+2 */}
          <td className="w-8 px-2 py-2.5 sticky left-0 z-10 bg-gray-100" />
          <td className="w-10 px-2 py-2.5 sticky left-8 z-10 bg-gray-100" />

          {/* Client Name - Sticky col 3 */}
          <td className="px-4 py-2.5 whitespace-nowrap sticky left-[72px] z-10 bg-gray-100 min-w-[140px]">
            <span className="text-sm text-slate-600 font-medium pl-3">
              {client.name}
            </span>
          </td>

          {/* Status Columns */}
          {procesColumns.map((column) => {
            const colData = client.columns[column.id];
            const hasDoubleStatus = colData?.status2 !== undefined;
            return (
              <td key={column.id} className="px-4 py-2.5 text-center min-w-[110px]">
                <div className="flex items-center justify-center gap-1.5">
                  <StatusIcon
                    status={colData?.status || 'pending'}
                    tooltip={getStatusTooltip(colData?.status || 'pending')}
                  />
                  {hasDoubleStatus && (
                    <StatusIcon
                      status={colData.status2!}
                      tooltip={getStatusTooltip(colData.status2!)}
                    />
                  )}
                </div>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
