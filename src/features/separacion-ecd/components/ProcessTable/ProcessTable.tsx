'use client';

import React, { useState } from 'react';
import { SubcuentaData } from '@/types/process';
import { ProcessTableRow } from '../ProcessTableRow/ProcessTableRow';
import { procesColumns } from '../../models/mockData';

interface ProcessTableProps {
  subcuentas: SubcuentaData[];
  selectedIds?: Set<string>;
  onSelectChange?: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
  isLoading?: boolean;
}

export function ProcessTable({
  subcuentas: initialSubcuentas,
  selectedIds: externalSelectedIds,
  onSelectChange: externalSelectChange,
  onSelectAll: externalSelectAll,
  isLoading = false,
}: ProcessTableProps) {
  const [subcuentas, setSubcuentas] = useState<SubcuentaData[]>(initialSubcuentas);
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(new Set());

  // Use external state if provided, otherwise use local state
  const selectedIds = externalSelectedIds ?? localSelectedIds;
  const handleSelectChange = externalSelectChange ?? ((id: string) => {
    const newSelected = new Set(localSelectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setLocalSelectedIds(newSelected);
  });

  const handleSelectAll = externalSelectAll ?? ((checked: boolean) => {
    if (checked) {
      setLocalSelectedIds(new Set(subcuentas.map((s) => s.id)));
    } else {
      setLocalSelectedIds(new Set());
    }
  });

  const handleToggleExpand = (id: string) => {
    setSubcuentas((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, isExpanded: !sub.isExpanded } : sub
      )
    );
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
              {/* Empty column for expand chevron */}
              <th className="w-8 bg-slate-50 sticky left-0 z-20" />
              <th className="w-10 px-2 py-3 text-left bg-slate-50 sticky left-8 z-20">
                <input
                  type="checkbox"
                  checked={selectedIds.size === subcuentas.length && subcuentas.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900 text-sm bg-slate-50 sticky left-[72px] z-20 min-w-[140px]">
                Subcuenta / Cliente
              </th>

              {/* Dynamic Column Headers */}
              {procesColumns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-center font-semibold text-slate-900 text-xs whitespace-nowrap min-w-[110px]"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-slate-100">
                  <td className="w-8 px-2 py-3 bg-white sticky left-0">
                    <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                  <td className="w-10 px-2 py-3 bg-white sticky left-8">
                    <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 bg-white sticky left-[72px] min-w-[140px]">
                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
                  </td>
                  {procesColumns.map((col) => (
                    <td key={col.id} className="px-4 py-3 text-center min-w-[110px]">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : subcuentas.length > 0 ? (
              subcuentas.map((subcuenta) => (
                <ProcessTableRow
                  key={subcuenta.id}
                  subcuenta={subcuenta}
                  isSelected={selectedIds.has(subcuenta.id)}
                  onToggleExpand={handleToggleExpand}
                  onSelectChange={handleSelectChange}
                />
              ))
            ) : (
              <tr>
                <td colSpan={100} className="px-4 py-12 text-center text-slate-500">
                  No hay subcuentas disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {subcuentas.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-600">
          <span className="font-medium">{selectedIds.size} seleccionado(s)</span>
          <div className="flex items-center gap-2">
            <span>Mostrando 1-{subcuentas.length} de {subcuentas.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
