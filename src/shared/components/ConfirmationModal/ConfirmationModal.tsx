'use client';

import React, { useState } from 'react';
import { AlertCircle, Trash2, Play, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import type { ValidationResult } from '@/features/separacion-ecd/utils/helpers';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionType: 'execute' | 'delete';
  selectedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  validationResults?: ValidationResult[];
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
  validationResults,
}: ConfirmationModalProps) {
  const [showValid, setShowValid] = useState(false);
  const [showInvalid, setShowInvalid] = useState(true);

  if (!isOpen) return null;

  const isDelete = actionType === 'delete';
  const validItems = validationResults?.filter((r) => r.isValid) ?? [];
  const invalidItems = validationResults?.filter((r) => !r.isValid) ?? [];
  const hasValidation = validationResults && validationResults.length > 0;
  const allInvalid = hasValidation && validItems.length === 0;
  const hasInvalid = invalidItems.length > 0;

  const buttonColor = allInvalid
    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
    : isDelete
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-[#e74038] hover:bg-[#d43529]';

  const confirmLabel = allInvalid
    ? 'Sin subcuentas válidas'
    : hasInvalid
      ? `${isDelete ? 'Eliminar' : 'Ejecutar'} con ${validItems.length} válida${validItems.length !== 1 ? 's' : ''}`
      : isDelete
        ? 'Eliminar'
        : 'Ejecutar';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
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

        {/* Validation Breakdown */}
        {hasValidation && (
          <div className="space-y-2">
            {/* Valid subcuentas */}
            {validItems.length > 0 && (
              <div className="border border-emerald-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowValid(!showValid)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-800 text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="flex-1 text-left">{validItems.length} subcuenta{validItems.length !== 1 ? 's' : ''} cumple{validItems.length === 1 ? '' : 'n'} requisitos</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-500 transition-transform ${showValid ? 'rotate-180' : ''}`} />
                </button>
                {showValid && (
                  <div className="px-3 py-2 bg-white border-t border-emerald-200 max-h-28 overflow-y-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {validItems.map((item) => (
                        <span key={item.subcuentaId} className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                          {item.subcuentaCode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Invalid subcuentas */}
            {invalidItems.length > 0 && (
              <div className="border border-amber-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowInvalid(!showInvalid)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="flex-1 text-left">{invalidItems.length} subcuenta{invalidItems.length !== 1 ? 's' : ''} no cumple{invalidItems.length === 1 ? '' : 'n'} requisitos</span>
                  <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${showInvalid ? 'rotate-180' : ''}`} />
                </button>
                {showInvalid && (
                  <div className="px-3 py-2 bg-white border-t border-amber-200 max-h-36 overflow-y-auto">
                    <div className="space-y-1.5">
                      {invalidItems.map((item) => (
                        <div key={item.subcuentaId} className="flex items-start gap-2 text-xs">
                          <span className="font-medium text-slate-700 min-w-[70px]">{item.subcuentaCode}</span>
                          <span className="text-amber-700">{item.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
            disabled={isLoading || allInvalid}
            className={`flex-1 px-4 py-2 text-white rounded-md transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${buttonColor}`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
