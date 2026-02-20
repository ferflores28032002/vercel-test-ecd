'use client';

import React from 'react';
import { AlertCircle, Trash2, Play } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionType: 'execute' | 'delete';
  selectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  actionType,
  selectedCount,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const isDelete = actionType === 'delete';
  const buttonColor = isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-[#e74038] hover:bg-[#d43529]';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-full ${isDelete ? 'bg-red-100' : 'bg-blue-100'}`}>
            {isDelete ? (
              <Trash2 className={`w-6 h-6 ${isDelete ? 'text-red-600' : 'text-blue-600'}`} />
            ) : (
              <Play className={`w-6 h-6 ${isDelete ? 'text-red-600' : 'text-blue-600'}`} />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-900">{title}</h2>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-sm text-slate-600">{message}</p>
          <p className="text-sm font-medium text-slate-900">
            Total de registros: <span className="text-[#e74038]">{selectedCount}</span>
          </p>
        </div>

        {/* Warning for Delete */}
        {isDelete && (
          <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">Esta acción no se puede deshacer.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-md transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${buttonColor}`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isDelete ? 'Eliminar' : 'Ejecutar'}
          </button>
        </div>
      </div>
    </div>
  );
}
