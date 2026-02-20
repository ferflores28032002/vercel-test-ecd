'use client';

import React, { useState } from 'react';
import { SubcuentaData } from '@/types/process';
import { ProcessTableRow } from '../ProcessTableRow/ProcessTableRow';
import { procesColumns, columnGroups, groupSeparatorIndices } from '../../models/mockData';

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
        <table className="min-w-max">
          {/* Table Header */}
          <thead>
            {/* Group Header Row */}
            <tr className="bg-slate-100">
              <th className="w-8 bg-slate-100 sticky left-0 z-20" />
              <th className="w-10 bg-slate-100 sticky left-8 z-20" />
              <th className="bg-slate-100 sticky left-[72px] z-20 min-w-[140px] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)]" />
              <th className="w-[5rem]" />
              {columnGroups.map((group, i) => (
                <React.Fragment key={group.label}>
                  {i > 0 && <th className="w-[7rem]" />}
                  <th
                    colSpan={group.colspan}
                    className="px-4 py-2 text-center font-bold text-slate-700 text-xs uppercase tracking-wider whitespace-nowrap "
                  >
                    {group.label}
                  </th>
                </React.Fragment>
              ))}
            </tr>
            {/* Column Header Row */}
            <tr className="border-b border-slate-200 bg-slate-100 sticky top-0 z-10">
              <th className="w-8 bg-slate-100 sticky left-0 z-20" />
              <th className="w-10 px-2 py-3 text-left bg-slate-100 sticky left-8 z-20">
                <input
                  type="checkbox"
                  checked={selectedIds.size === subcuentas.length && subcuentas.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900 text-xs bg-slate-100 sticky left-[72px] z-20 min-w-[140px] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                Subcuenta / Cliente
              </th>
              <th className="w-[5rem] bg-slate-100" />
              {procesColumns.map((column, index) => (
                <React.Fragment key={column.id}>
                  {groupSeparatorIndices.has(index) && <th className="w-[7rem]" />}
                  <th className="px-3 py-2 text-center font-semibold text-slate-900 text-xs whitespace-nowrap">
                    {column.label}
                  </th>
                </React.Fragment>
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
                  <td className="w-[5rem]" />
                  {procesColumns.map((col, index) => (
                    <React.Fragment key={col.id}>
                      {groupSeparatorIndices.has(index) && <td className="w-[7rem]" />}
                      <td className="px-0 py-3 text-center">
                        <div className="flex justify-center">
                          <div className="h-6 w-6 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                      </td>
                    </React.Fragment>
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
