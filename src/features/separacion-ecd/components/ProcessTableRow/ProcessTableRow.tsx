'use client';

import React, { useState } from 'react';
import { ChevronDown, MoreHorizontal, Trash2, Play } from 'lucide-react';
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
  const [showActions, setShowActions] = useState(false);

  const handleActionClick = (action: string) => {
    console.log(`${action} on ${subcuenta.code}`);
    setShowActions(false);
  };

  return (
    <>
      {/* Main Row */}
      <tr
        className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${
          isSelected ? 'bg-red-50' : ''
        }`}
      >
        {/* Expand chevron - Sticky col 1 */}
        <td className="w-8 px-2 py-3 sticky left-0 z-10 bg-white hover:bg-slate-50/50">
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
        <td className="w-10 px-2 py-3 sticky left-8 z-10 bg-white hover:bg-slate-50/50">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectChange(subcuenta.id)}
            className="w-4 h-4 rounded border-slate-300 cursor-pointer"
          />
        </td>

        {/* Subcuenta Code - Sticky col 3 */}
        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sticky left-[72px] z-10 bg-white hover:bg-slate-50/50 min-w-[140px]">
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

      {/* Expanded Details Row */}
      {subcuenta.isExpanded && (
        <tr className="bg-gradient-to-b from-slate-50/80 to-slate-50/30 border-b border-slate-200">
          <td colSpan={100} className="px-4 py-3">
            <div className="space-y-1.5">
              <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Detalles de Procesamiento</h4>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                {procesColumns.map((column) => {
                  const colData = subcuenta.columns[column.id];
                  const status = colData?.status || 'pending';
                  const borderColor =
                    status === 'success' ? 'border-l-emerald-400' :
                    status === 'error' ? 'border-l-red-400' :
                    status === 'in-progress' ? 'border-l-sky-400' :
                    'border-l-amber-300';
                  return (
                    <div
                      key={column.id}
                      className={`bg-white rounded border border-slate-200 border-l-2 ${borderColor} px-2 py-1.5 hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-[10px] font-semibold text-slate-600 uppercase truncate leading-tight">
                          {column.label}
                        </p>
                        <div className="flex items-center gap-1">
                          <StatusIcon
                            status={status}
                            tooltip={getStatusTooltip(status)}
                          />
                          {colData?.status2 && (
                            <StatusIcon
                              status={colData.status2}
                              tooltip={getStatusTooltip(colData.status2)}
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-tight truncate font-medium">
                        {colData?.executedBy || 'Sin asignar'}
                      </p>
                      {colData?.executedBy2 && (
                        <p className="text-[11px] text-slate-700 leading-tight truncate font-medium">
                          {colData.executedBy2}
                        </p>
                      )}
                      {colData?.lastUpdate && (
                        <p className="text-[10px] text-slate-500 leading-tight">
                          {colData.lastUpdate}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
