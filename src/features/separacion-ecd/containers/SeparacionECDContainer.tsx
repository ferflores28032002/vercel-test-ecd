'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '../components/Header/Header';
import { FilterSection } from '../components/FilterSection/FilterSection';
import { ProcessTable } from '../components/ProcessTable/ProcessTable';
import { ActionsBar } from '../components/ActionsBar/ActionsBar';
import { useSeparacionECD } from '../hooks/useSeparacionECD';
import { mockSeparacionECDData } from '../models/mockData';

export function SeparacionECDContainer() {
  const {
    subcuentas,
    selectedIds,
    startDate,
    endDate,
    setDateRange,
    executeAction,
    deleteAction,
  } = useSeparacionECD(
    mockSeparacionECDData.subcuentas,
    mockSeparacionECDData.startDate,
    mockSeparacionECDData.endDate
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const handleExecute = () => {
    executeAction(Array.from(selectedIds));
  };

  const handleDelete = () => {
    deleteAction(Array.from(selectedIds));
  };

  return (
    <main className="w-full p-6 space-y-6 overflow-x-hidden">
      {/* Header */}
      <Header
        title="Separación de Estado de Cuenta Diario"
        breadcrumb={[
          { label: 'Procesos MEM' },
          { label: 'Separación ECD' },
        ]}
      />

      {/* Filter Section with Circular Progress */}
      <FilterSection
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(date) => setDateRange(date, endDate)}
        onEndDateChange={(date) => setDateRange(startDate, date)}
        onRefresh={handleRefresh}
        subcuentas={subcuentas}
        isRefreshing={isRefreshing}
      />

      {/* Actions Bar */}
      <ActionsBar
        selectedCount={selectedIds.size}
        subcuentas={subcuentas}
        selectedIds={selectedIds}
        onExecute={handleExecute}
        onDelete={handleDelete}
      />

      {/* Process Table */}
      <ProcessTable subcuentas={subcuentas} isLoading={isRefreshing} />
    </main>
  );
}
