# Ejemplos de Código - Extensiones Futuras

## Ejemplo 1: Agregar una Nueva Feature Completa

### Paso 1: Crear estructura
```bash
mkdir -p src/features/resumen-mensual/{components,containers,hooks,models,utils}
```

### Paso 2: Crear tipos
```tsx
// src/features/resumen-mensual/models/types.ts
export interface ResumenMensual {
  mes: string;
  año: number;
  totalSubcuentas: number;
  procesadas: number;
  conError: number;
  porcentajeComplecion: number;
}

export type ResumenEstado = 'cargando' | 'exito' | 'error';
```

### Paso 3: Crear componentes
```tsx
// src/features/resumen-mensual/components/ResumenCard.tsx
'use client';

import React from 'react';
import { ResumenMensual } from '../models/types';

interface ResumenCardProps {
  data: ResumenMensual;
}

export function ResumenCard({ data }: ResumenCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-900">
            {data.mes} {data.año}
          </h3>
          <p className="text-sm text-slate-600">Resumen mensual</p>
        </div>
        <span className="text-2xl font-bold text-[#C1232B]">
          {data.porcentajeComplecion}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-lg font-semibold text-slate-900">
            {data.totalSubcuentas}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Procesadas</p>
          <p className="text-lg font-semibold text-green-700">
            {data.procesadas}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Errores</p>
          <p className="text-lg font-semibold text-red-700">
            {data.conError}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Paso 4: Crear container
```tsx
// src/features/resumen-mensual/containers/ResumenMensualContainer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ResumenCard } from '../components/ResumenCard';
import { ResumenMensual, ResumenEstado } from '../models/types';

export function ResumenMensualContainer() {
  const [data, setData] = useState<ResumenMensual | null>(null);
  const [estado, setEstado] = useState<ResumenEstado>('cargando');

  useEffect(() => {
    // Simulación de fetch
    const mockData: ResumenMensual = {
      mes: 'Diciembre',
      año: 2025,
      totalSubcuentas: 245,
      procesadas: 210,
      conError: 12,
      porcentajeComplecion: 86,
    };

    setTimeout(() => {
      setData(mockData);
      setEstado('exito');
    }, 500);
  }, []);

  if (estado === 'cargando') {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  if (estado === 'error' || !data) {
    return (
      <div className="p-6 text-center text-red-700">
        Error al cargar los datos
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Resumen Mensual
      </h1>
      <ResumenCard data={data} />
    </main>
  );
}
```

### Paso 5: Exportar
```tsx
// src/features/resumen-mensual/index.ts
export { ResumenMensualContainer } from './containers/ResumenMensualContainer';
export { ResumenCard } from './components/ResumenCard';
export type { ResumenMensual } from './models/types';
```

### Paso 6: Usar en página
```tsx
// app/resumen-mensual/page.tsx
import { ResumenMensualContainer } from '@/features/resumen-mensual';

export default function Page() {
  return <ResumenMensualContainer />;
}
```

---

## Ejemplo 2: Integración con API Real

```tsx
// src/features/separacion-ecd/services/api.ts
import { SubcuentaData } from '@/types/process';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchSubcuentas(): Promise<SubcuentaData[]> {
  try {
    const response = await fetch(`${API_BASE}/procesos/separacion-ecd/subcuentas`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subcuentas:', error);
    throw error;
  }
}

export async function executeAction(subcuentaIds: string[]): Promise<void> {
  const response = await fetch(`${API_BASE}/procesos/separacion-ecd/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subcuentaIds }),
  });
  
  if (!response.ok) {
    throw new Error('Error executing action');
  }
}

export async function deleteAction(subcuentaIds: string[]): Promise<void> {
  const response = await fetch(`${API_BASE}/procesos/separacion-ecd/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subcuentaIds }),
  });
  
  if (!response.ok) {
    throw new Error('Error deleting action');
  }
}
```

---

## Ejemplo 3: Hook Mejorado con SWR

```tsx
// src/features/separacion-ecd/hooks/useSeparacionECDData.ts
import useSWR from 'swr';
import { SeparacionECDData } from '@/types/process';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSeparacionECDData() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/procesos/separacion-ecd',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minuto
    }
  );

  return {
    data: data as SeparacionECDData | undefined,
    isLoading,
    isError: !!error,
    error,
    mutate, // Para refrescar manualmente
  };
}
```

---

## Ejemplo 4: Sistema de Notificaciones

```tsx
// src/shared/components/Toast/Toast.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: <XCircle className="w-5 h-5" />,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: <AlertCircle className="w-5 h-5" />,
  },
};

export function Toast({ message, type, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = toastConfig[type];

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bg} ${config.border} ${config.text}`}
    >
      {config.icon}
      <span className="font-medium">{message}</span>
    </div>
  );
}
```

---

## Ejemplo 5: Testing de Componentes

```tsx
// __tests__/StatusBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/shared/components/StatusBadge/StatusBadge';

describe('StatusBadge', () => {
  it('renders with correct status', () => {
    render(
      <StatusBadge status="send" tooltip="Enviado correctamente" />
    );
    
    const badge = screen.getByText('Enviado');
    expect(badge).toBeInTheDocument();
  });

  it('shows tooltip on hover', () => {
    render(
      <StatusBadge status="error" tooltip="Error en procesamiento" />
    );
    
    const badge = screen.getByTitle('Error en procesamiento');
    expect(badge).toBeInTheDocument();
  });

  it('renders all status types', () => {
    const statuses = ['pending', 'in-progress', 'error', 'send'];
    
    statuses.forEach(status => {
      render(
        <StatusBadge status={status as any} />
      );
    });
    
    expect(screen.getAllByRole('generic')).toHaveLength(4);
  });
});
```

---

## Ejemplo 6: Filtros Avanzados

```tsx
// src/features/separacion-ecd/components/AdvancedFilters.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AdvancedFiltersProps {
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  status: string[];
  dateRange: { start: string; end: string };
  subcuentas: string[];
}

export function AdvancedFilters({ onApply }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    dateRange: { start: '', end: '' },
    subcuentas: [],
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
      >
        Filtros avanzados
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-4 space-y-4">
          {/* Filtro de Estados */}
          <div>
            <label className="font-medium text-slate-900 text-sm">Estados</label>
            <div className="space-y-2 mt-2">
              {['pending', 'in-progress', 'error', 'send'].map(status => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleStatusChange(status)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              onApply(filters);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 bg-[#C1232B] text-white rounded-md hover:bg-[#A11D26]"
          >
            Aplicar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Ejemplo 7: Modo Oscuro (Futuro)

```tsx
// src/shared/hooks/useTheme.ts
import { useEffect, useState } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDark') === 'true';
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('isDark', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { isDark, toggleTheme };
}
```

---

Estos ejemplos demuestran cómo la arquitectura es flexible y escalable para agregar nuevas funcionalidades manteniendo la consistencia y calidad del código.
