'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, Search, Info, Check, Clock, X, Zap, BarChart3, CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { SubcuentaData } from '@/types/process';
import { procesColumns } from '../../models/mockData';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface FilterSectionProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onRefresh: () => void;
  subcuentas?: SubcuentaData[];
}

const STATUS_CONFIG = [
  { key: 'success' as const, color: '#16A34A', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Éxito', icon: Check },
  { key: 'in-progress' as const, color: '#0EA5E9', bg: 'bg-sky-50', border: 'border-sky-200', label: 'En Progreso', icon: Zap },
  { key: 'pending' as const, color: '#EA8C00', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pendiente', icon: Clock },
  { key: 'error' as const, color: '#DC2626', bg: 'bg-red-50', border: 'border-red-200', label: 'Error', icon: X },
];

export function FilterSection({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRefresh,
  subcuentas = [],
}: FilterSectionProps) {
  const [showLegend, setShowLegend] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      // Support dd/mm/yyyy and yyyy-mm-dd
      if (dateStr.includes('/')) return parse(dateStr, 'dd/MM/yyyy', new Date());
      return new Date(dateStr);
    } catch { return undefined; }
  };

  const formatDateForDisplay = (dateStr: string): string => {
    const d = parseDate(dateStr);
    if (!d || isNaN(d.getTime())) return 'Seleccionar fecha';
    return format(d, "dd 'de' MMM, yyyy", { locale: es });
  };

  const handleDateSelect = (date: Date | undefined, type: 'start' | 'end') => {
    if (!date) return;
    const formatted = format(date, 'dd/MM/yyyy');
    if (type === 'start') {
      onStartDateChange(formatted);
      setStartOpen(false);
    } else {
      onEndDateChange(formatted);
      setEndOpen(false);
    }
  };

  const stats = useMemo(() => {
    let success = 0;
    let pending = 0;
    let inProgress = 0;
    let error = 0;

    subcuentas.forEach((sub) => {
      Object.values(sub.columns).forEach((col) => {
        switch (col.status) {
          case 'success': success++; break;
          case 'pending': pending++; break;
          case 'in-progress': inProgress++; break;
          case 'error': error++; break;
        }
      });
    });

    const total = success + pending + inProgress + error;
    return { success, pending, inProgress, error, total };
  }, [subcuentas]);

  // Per-column breakdown
  const columnStats = useMemo(() => {
    return procesColumns.map((col) => {
      let success = 0, pending = 0, inProgress = 0, error = 0;
      subcuentas.forEach((sub) => {
        const status = sub.columns[col.id]?.status;
        if (status === 'success') success++;
        else if (status === 'pending') pending++;
        else if (status === 'in-progress') inProgress++;
        else if (status === 'error') error++;
      });
      const total = success + pending + inProgress + error;
      return { ...col, success, pending, inProgress, error, total };
    });
  }, [subcuentas]);

  const completedPct = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
  const errorPct = stats.total > 0 ? Math.round((stats.error / stats.total) * 100) : 0;
  const inProgressPct = stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;

  // Donut chart segments
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const segments = useMemo(() => {
    if (stats.total === 0) return [];
    const items = [
      { count: stats.success, color: '#16A34A', label: 'Éxito' },
      { count: stats.inProgress, color: '#0EA5E9', label: 'En Progreso' },
      { count: stats.pending, color: '#EA8C00', label: 'Pendiente' },
      { count: stats.error, color: '#DC2626', label: 'Error' },
    ];
    let offset = 0;
    return items
      .filter((s) => s.count > 0)
      .map((s) => {
        const pct = s.count / stats.total;
        const dash = circumference * pct;
        const seg = { ...s, pct, dash, offset };
        offset += dash;
        return seg;
      });
  }, [stats, circumference]);

  // Large donut for modal
  const modalRadius = 80;
  const modalCircumference = 2 * Math.PI * modalRadius;
  const modalSegments = useMemo(() => {
    if (stats.total === 0) return [];
    const items = [
      { count: stats.success, color: '#16A34A', label: 'Éxito' },
      { count: stats.inProgress, color: '#0EA5E9', label: 'En Progreso' },
      { count: stats.pending, color: '#EA8C00', label: 'Pendiente' },
      { count: stats.error, color: '#DC2626', label: 'Error' },
    ];
    let offset = 0;
    return items
      .filter((s) => s.count > 0)
      .map((s) => {
        const pct = s.count / stats.total;
        const dash = modalCircumference * pct;
        const seg = { ...s, pct, dash, offset };
        offset += dash;
        return seg;
      });
  }, [stats, modalCircumference]);

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 p-5 relative">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Date Pickers */}
          <div className="flex items-start gap-3 min-w-max">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-500 text-xs">Inicio</label>
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal h-9 text-sm border-slate-300 shadow-none"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    <span className={startDate ? 'text-slate-900' : 'text-slate-400'}>
                      {formatDateForDisplay(startDate)}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(startDate)}
                    onSelect={(d) => handleDateSelect(d, 'start')}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-500 text-xs">Fin</label>
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-start text-left font-normal h-9 text-sm border-slate-300 shadow-none"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    <span className={endDate ? 'text-slate-900' : 'text-slate-400'}>
                      {formatDateForDisplay(endDate)}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(endDate)}
                    onSelect={(d) => handleDateSelect(d, 'end')}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Center: Donut Chart + Stats */}
          <div className="flex items-center gap-5">
            {/* Donut - clickable */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="relative cursor-pointer group flex flex-col items-center gap-1"
              title="Ver detalles"
            >
              <svg className="w-[72px] h-[72px] group-hover:scale-105 transition-transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="7" />
                {segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="7"
                    strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                    strokeDashoffset={-seg.offset}
                    strokeLinecap="butt"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-500"
                  />
                ))}
                <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0F172A">
                  {completedPct}%
                </text>
                <text x="50" y="60" textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569">
                  completado
                </text>
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold group-hover:text-[#e74038] transition-colors flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Ver detalle
              </span>
            </button>

            {/* Mini stat pills */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {STATUS_CONFIG.map((s) => {
                const count = s.key === 'success' ? stats.success : s.key === 'in-progress' ? stats.inProgress : s.key === 'pending' ? stats.pending : stats.error;
                return (
                  <div key={s.key} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-slate-600 font-medium">{count} {s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Search and Refresh */}
          <div className="flex items-center gap-2 min-w-max">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e74038]/20 text-sm w-40"
              />
            </div>

            <button
              onClick={onRefresh}
              className="p-2.5 bg-[#e74038] text-white rounded-md hover:bg-[#d43529] transition-colors group relative"
              title="Actualizar datos"
            >
              <RotateCcw className="w-5 h-5" />
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Actualizar
              </div>
            </button>

            <button
              onClick={() => setShowLegend(!showLegend)}
              className="p-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors group relative"
              title="Ver leyenda de status"
            >
              <Info className="w-5 h-5" />
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Leyenda
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Legend Modal */}
      {showLegend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLegend(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Leyenda de Estados</h2>
              <button
                onClick={() => setShowLegend(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {STATUS_CONFIG.map((s) => {
                const Icon = s.icon;
                const count = s.key === 'success' ? stats.success : s.key === 'in-progress' ? stats.inProgress : s.key === 'pending' ? stats.pending : stats.error;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                const descriptions: Record<string, string> = {
                  success: 'El proceso se completó correctamente sin errores.',
                  'in-progress': 'El proceso se está ejecutando en este momento.',
                  pending: 'El proceso está en espera de ser ejecutado.',
                  error: 'El proceso falló durante la ejecución.',
                };
                return (
                  <div key={s.key} className={`${s.bg} border ${s.border} rounded-xl p-4 flex items-start gap-4`}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.color + '20' }}>
                      <Icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={s.key === 'success' || s.key === 'error' ? 3 : 2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-900">{s.label}</span>
                        <span className="text-sm font-bold" style={{ color: s.color }}>{count} ({pct}%)</span>
                      </div>
                      <p className="text-xs text-slate-500">{descriptions[s.key]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Resumen de Procesamiento</h2>
                <p className="text-sm text-slate-500">Separación ECD &mdash; {subcuentas.length} subcuentas &middot; {stats.total} procesos</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Top Section: Large Donut + Summary Cards */}
              <div className="flex items-start gap-8">
                {/* Large Donut */}
                <div className="flex-shrink-0">
                  <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={modalRadius} fill="none" stroke="#F1F5F9" strokeWidth="14" />
                    {modalSegments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="100"
                        cy="100"
                        r={modalRadius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={`${seg.dash} ${modalCircumference - seg.dash}`}
                        strokeDashoffset={-seg.offset}
                        strokeLinecap="butt"
                        transform="rotate(-90 100 100)"
                        className="transition-all duration-700"
                      />
                    ))}
                    <text x="100" y="90" textAnchor="middle" fontSize="36" fontWeight="800" fill="#0F172A">
                      {completedPct}%
                    </text>
                    <text x="100" y="112" textAnchor="middle" fontSize="12" fontWeight="500" fill="#94A3B8">
                      completado
                    </text>
                    <text x="100" y="128" textAnchor="middle" fontSize="10" fontWeight="500" fill="#CBD5E1">
                      {stats.success} de {stats.total}
                    </text>
                  </svg>
                </div>

                {/* Summary Cards */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {STATUS_CONFIG.map((s) => {
                    const count = s.key === 'success' ? stats.success : s.key === 'in-progress' ? stats.inProgress : s.key === 'pending' ? stats.pending : stats.error;
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    const Icon = s.icon;
                    return (
                      <div key={s.key} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" style={{ color: s.color }} strokeWidth={s.key === 'success' || s.key === 'error' ? 3 : 2} />
                            <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                          </div>
                          <span className="text-lg font-bold" style={{ color: s.color }}>{count}</span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: s.color }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{pct}% del total</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200" />

              {/* Per-Process Breakdown */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Desglose por Proceso</h3>
                <div className="space-y-2">
                  {columnStats.map((col) => (
                    <div key={col.id} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600 w-28 truncate">{col.label}</span>
                      {/* Stacked bar */}
                      <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden flex">
                        {col.total > 0 && (
                          <>
                            {col.success > 0 && (
                              <div
                                className="h-full bg-[#16A34A] transition-all duration-500"
                                style={{ width: `${(col.success / col.total) * 100}%` }}
                                title={`${col.success} éxito`}
                              />
                            )}
                            {col.inProgress > 0 && (
                              <div
                                className="h-full bg-[#0EA5E9] transition-all duration-500"
                                style={{ width: `${(col.inProgress / col.total) * 100}%` }}
                                title={`${col.inProgress} en progreso`}
                              />
                            )}
                            {col.pending > 0 && (
                              <div
                                className="h-full bg-[#EA8C00] transition-all duration-500"
                                style={{ width: `${(col.pending / col.total) * 100}%` }}
                                title={`${col.pending} pendiente`}
                              />
                            )}
                            {col.error > 0 && (
                              <div
                                className="h-full bg-[#DC2626] transition-all duration-500"
                                style={{ width: `${(col.error / col.total) * 100}%` }}
                                title={`${col.error} error`}
                              />
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 min-w-[120px] justify-end">
                        <span className="text-[10px] font-semibold text-emerald-600">{col.success}</span>
                        <span className="text-[10px] text-slate-300">/</span>
                        <span className="text-[10px] font-semibold text-sky-500">{col.inProgress}</span>
                        <span className="text-[10px] text-slate-300">/</span>
                        <span className="text-[10px] font-semibold text-amber-500">{col.pending}</span>
                        <span className="text-[10px] text-slate-300">/</span>
                        <span className="text-[10px] font-semibold text-red-500">{col.error}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Stats Row */}
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-around">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{subcuentas.length}</p>
                  <p className="text-xs text-slate-500">Subcuentas</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{completedPct}%</p>
                  <p className="text-xs text-slate-500">Completado</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">{errorPct}%</p>
                  <p className="text-xs text-slate-500">Con Error</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-sky-500">{inProgressPct}%</p>
                  <p className="text-xs text-slate-500">En Progreso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
