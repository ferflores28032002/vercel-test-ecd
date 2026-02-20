'use client';

import React from 'react';
import { Sidebar } from '@/shared/components/Sidebar/Sidebar';
import { Menu } from 'lucide-react';
import { BarChart3, FileText, Settings, Users, Zap, Send, MoreVertical } from 'lucide-react';

const sidebarItems = [
  {
    id: 'procesos-mem',
    label: 'Procesos MEM',
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      {
        id: 'separacion-ecd',
        label: 'Separación ECD',
        icon: <FileText className="w-5 h-5" />,
        isActive: true,
      },
      {
        id: 'resumen-mensual',
        label: 'Resumen Mensual',
        icon: <FileText className="w-5 h-5" />,
      },
      {
        id: 'liquidacion-suministro',
        label: 'Liquidación Suministro',
        icon: <FileText className="w-5 h-5" />,
      },
      {
        id: 'monitor-documentos',
        label: 'Monitor de documentos',
        icon: <FileText className="w-5 h-5" />,
      },
      {
        id: 'parametros',
        label: 'Parámetros',
        icon: <Settings className="w-5 h-5" />,
      },
      {
        id: 'validaciones-generacion',
        label: 'Validaciones Generación',
        icon: <FileText className="w-5 h-5" />,
      },
    ],
  },
  {
    id: 'nominaciones',
    label: 'Nominaciones',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'generacion-distribuida',
    label: 'Generación Distribuida',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 'importacion-datos',
    label: 'Importación de datos',
    icon: <Send className="w-5 h-5" />,
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 'eyotr',
    label: 'EyOTR',
    icon: <MoreVertical className="w-5 h-5" />,
  },
  {
    id: 'ercot',
    label: 'ERCOT',
    icon: <MoreVertical className="w-5 h-5" />,
  },
];

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const handleSidebarItemClick = (id: string) => {
    console.log('Navigating to:', id);
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar items={sidebarItems} onItemClick={handleSidebarItemClick} />

      {/* Top Bar and Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3 lg:hidden">
            <Menu className="w-6 h-6 text-slate-600" />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-2xl">🔔</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-2xl">👤</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 bg-slate-50 overflow-hidden min-w-0">
          <div className="h-full overflow-y-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
