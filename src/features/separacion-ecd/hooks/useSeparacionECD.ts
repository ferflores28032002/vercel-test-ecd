import { useState, useCallback } from 'react';
import { SubcuentaData } from '@/types/process';

interface UseSeparacionECDReturn {
  subcuentas: SubcuentaData[];
  selectedIds: Set<string>;
  startDate: string;
  endDate: string;
  toggleExpand: (id: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: (checked: boolean) => void;
  setDateRange: (start: string, end: string) => void;
  executeAction: (ids: string[]) => void;
  deleteAction: (ids: string[]) => void;
}

export function useSeparacionECD(
  initialSubcuentas: SubcuentaData[],
  initialStartDate: string,
  initialEndDate: string
): UseSeparacionECDReturn {
  const [subcuentas, setSubcuentas] = useState<SubcuentaData[]>(initialSubcuentas);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const toggleExpand = useCallback((id: string) => {
    setSubcuentas((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, isExpanded: !sub.isExpanded } : sub
      )
    );
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(subcuentas.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [subcuentas]);

  const setDateRange = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const executeAction = useCallback((ids: string[]) => {
    console.log('Executing actions for:', ids);
    // Aquí iría la lógica para ejecutar las acciones
  }, []);

  const deleteAction = useCallback((ids: string[]) => {
    console.log('Deleting actions for:', ids);
    // Aquí iría la lógica para eliminar las acciones
  }, []);

  return {
    subcuentas,
    selectedIds,
    startDate,
    endDate,
    toggleExpand,
    toggleSelect,
    selectAll,
    setDateRange,
    executeAction,
    deleteAction,
  };
}
