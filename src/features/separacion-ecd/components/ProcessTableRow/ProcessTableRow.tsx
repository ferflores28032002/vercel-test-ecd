'use client';

import React, { useState } from 'react';
import { ChevronDown, CircleEllipsis } from 'lucide-react';
import { SubcuentaData } from '@/types/process';
import { StatusIcon } from '@/shared/components/StatusIcon/StatusIcon';
import { getStatusTooltip } from '../../utils/helpers';
import { procesColumns } from '../../models/mockData';

interface PendingModalInfo {
  subcuentaCode: string;
  columnLabel: string;
}

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
  const [pendingModal, setPendingModal] = useState<PendingModalInfo | null>(null);

  const handlePendingClick = (code: string, columnLabel: string) => {
    setPendingModal({ subcuentaCode: code, columnLabel });
  };

  const handleConfirm = () => {
    // TODO: implement processing logic
    setPendingModal(null);
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
          const status1 = colData?.status || 'pending';
          const status2 = colData?.status2;
          return (
            <td key={column.id} className="px-4 py-3 text-center min-w-[110px]">
              <div className="flex items-center justify-center gap-1.5">
                <StatusIcon
                  status={status1}
                  tooltip={getStatusTooltip(status1)}
                  onClick={status1 === 'pending' ? () => handlePendingClick(subcuenta.code, column.label) : undefined}
                />
                {hasDoubleStatus && (
                  <StatusIcon
                    status={status2!}
                    tooltip={getStatusTooltip(status2!)}
                    onClick={status2 === 'pending' ? () => handlePendingClick(subcuenta.code, column.label) : undefined}
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
            const status1 = colData?.status || 'pending';
            const status2 = colData?.status2;
            return (
              <td key={column.id} className="px-4 py-2.5 text-center min-w-[110px]">
                <div className="flex items-center justify-center gap-1.5">
                  <StatusIcon
                    status={status1}
                    tooltip={getStatusTooltip(status1)}
                    onClick={status1 === 'pending' ? () => handlePendingClick(client.name, column.label) : undefined}
                  />
                  {hasDoubleStatus && (
                    <StatusIcon
                      status={status2!}
                      tooltip={getStatusTooltip(status2!)}
                      onClick={status2 === 'pending' ? () => handlePendingClick(client.name, column.label) : undefined}
                    />
                  )}
                </div>
              </td>
            );
          })}
        </tr>
      ))}

      {/* Pending Confirmation Modal */}
      {pendingModal && (
        <tr>
          <td colSpan={0} className="p-0 border-0">
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-full bg-blue-100">
                    <CircleEllipsis className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-slate-900">Confirmar procesamiento</h2>
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm text-slate-600">
                  ¿Desea ejecutar el procesamiento de{' '}
                  <span className="font-semibold text-slate-900">{pendingModal.columnLabel}</span>{' '}
                  para <span className="font-semibold text-slate-900">{pendingModal.subcuentaCode}</span>?
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setPendingModal(null)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-md transition-colors font-medium"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
