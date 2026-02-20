'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Play, ChevronDown } from 'lucide-react';
import { ConfirmationModal } from '@/shared/components/ConfirmationModal/ConfirmationModal';

interface ActionsBarProps {
  selectedCount: number;
  onExecute: () => void;
  onDelete: () => void;
}

const AVAILABLE_ACTIONS = [
  'Segregación Automática de Mediciones',
  'Validación Automática de Oferta',
  'Ejecución de Tablas MEM',
  'Validación de ECyP',
  'Revisión',
];

export function ActionsBar({ selectedCount, onExecute, onDelete }: ActionsBarProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState<'execute' | 'delete'>('execute');
  const [isLoading, setIsLoading] = useState(false);
  const [showExecuteDropdown, setShowExecuteDropdown] = useState(false);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [selectedExecuteActions, setSelectedExecuteActions] = useState<Set<string>>(new Set());
  const [selectedDeleteActions, setSelectedDeleteActions] = useState<Set<string>>(new Set());
  const executeDropdownRef = useRef<HTMLDivElement>(null);
  const deleteDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (executeDropdownRef.current && !executeDropdownRef.current.contains(event.target as Node)) {
        setShowExecuteDropdown(false);
      }
      if (deleteDropdownRef.current && !deleteDropdownRef.current.contains(event.target as Node)) {
        setShowDeleteDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteActionToggle = (action: string) => {
    const newSet = new Set(selectedExecuteActions);
    if (newSet.has(action)) {
      newSet.delete(action);
    } else {
      newSet.add(action);
    }
    setSelectedExecuteActions(newSet);
  };

  const handleDeleteActionToggle = (action: string) => {
    const newSet = new Set(selectedDeleteActions);
    if (newSet.has(action)) {
      newSet.delete(action);
    } else {
      newSet.add(action);
    }
    setSelectedDeleteActions(newSet);
  };

  const handleExecuteConfirm = () => {
    if (selectedExecuteActions.size > 0) {
      setModalAction('execute');
      setShowConfirmModal(true);
      setShowExecuteDropdown(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedDeleteActions.size > 0) {
      setModalAction('delete');
      setShowConfirmModal(true);
      setShowDeleteDropdown(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (modalAction === 'execute') {
        onExecute();
      } else {
        onDelete();
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6 gap-6">
        {/* Delete Actions Dropdown */}
        <div className="relative" ref={deleteDropdownRef}>
          <button
            onClick={() => setShowDeleteDropdown(!showDeleteDropdown)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all bg-[#e74038] text-white hover:bg-[#d43529] active:scale-95 shadow-md hover:shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
            <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showDeleteDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Delete Actions Dropdown Menu */}
          {showDeleteDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 min-w-max w-80">
              <div className="space-y-2">
                <div className="font-semibold text-sm text-slate-900 px-2 py-1">Selecciona acciones para eliminar</div>
                {AVAILABLE_ACTIONS.map((action) => (
                  <label key={action} className="flex items-center gap-3 px-2 py-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedDeleteActions.has(action)}
                      onChange={() => handleDeleteActionToggle(action)}
                      className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700">{action}</span>
                  </label>
                ))}
              </div>
              <div className="border-t border-slate-200 mt-3 pt-3 flex gap-2">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={selectedDeleteActions.size === 0}
                  className={`flex-1 px-3 py-2 rounded font-medium text-sm transition-all ${
                    selectedDeleteActions.size === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#e74038] text-white hover:bg-[#d43529]'
                  }`}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowDeleteDropdown(false)}
                  className="flex-1 px-3 py-2 rounded font-medium text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center Text - Selection Count */}
        <div className="text-sm font-medium text-slate-600 flex-1 text-center">
          {selectedCount > 0 && (
            <span>
              <span className="text-[#e74038] font-bold text-base">{selectedCount}</span>
              {' '}seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Execute Actions Dropdown */}
        <div className="relative" ref={executeDropdownRef}>
          <button
            onClick={() => setShowExecuteDropdown(!showExecuteDropdown)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all bg-[#e74038] text-white hover:bg-[#d43529] active:scale-95 shadow-md hover:shadow-lg"
          >
            <Play className="w-4 h-4" />
            <span>Ejecutar</span>
            <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showExecuteDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Execute Actions Dropdown Menu */}
          {showExecuteDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 min-w-max w-80">
              <div className="space-y-2">
                <div className="font-semibold text-sm text-slate-900 px-2 py-1">Selecciona acciones a ejecutar</div>
                {AVAILABLE_ACTIONS.map((action) => (
                  <label key={action} className="flex items-center gap-3 px-2 py-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedExecuteActions.has(action)}
                      onChange={() => handleExecuteActionToggle(action)}
                      className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700">{action}</span>
                  </label>
                ))}
              </div>
              <div className="border-t border-slate-200 mt-3 pt-3 flex gap-2">
                <button
                  onClick={handleExecuteConfirm}
                  disabled={selectedExecuteActions.size === 0}
                  className={`flex-1 px-3 py-2 rounded font-medium text-sm transition-all ${
                    selectedExecuteActions.size === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#e74038] text-white hover:bg-[#d43529]'
                  }`}
                >
                  Ejecutar
                </button>
                <button
                  onClick={() => setShowExecuteDropdown(false)}
                  className="flex-1 px-3 py-2 rounded font-medium text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={modalAction === 'execute' ? 'Ejecutar Acciones' : 'Eliminar Acciones'}
        message={
          modalAction === 'execute'
            ? 'Estás a punto de ejecutar las acciones seleccionadas. Este proceso puede tomar algunos minutos.'
            : 'Estás a punto de eliminar las acciones seleccionadas de forma permanente.'
        }
        actionType={modalAction}
        selectedCount={selectedCount}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isLoading}
      />
    </>
  );
}
