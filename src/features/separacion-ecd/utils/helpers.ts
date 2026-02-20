import { SubcuentaData, ProcessStatus } from '@/types/process';

export type StatusType = 'success' | 'pending' | 'error' | 'in-progress';

export interface ValidationResult {
  subcuentaId: string;
  subcuentaCode: string;
  isValid: boolean;
  reason?: string;
}

const ACTION_COLUMN_MAP: Record<string, string> = {
  'Segregación Automática de Mediciones': 'medicion',
  'Validación Automática de Oferta': 'oferta',
  'Ejecución de Tablas MEM': 'ecd_dataset',
  'Validación de ECyP': 'ecyp',
  'Revisión': 'validacion',
};

const COLUMN_LABELS: Record<string, string> = {
  medicion: 'Medición',
  oferta: 'Oferta',
  ecd_dataset: 'ECD Dataset',
  ecyp: 'ECyP',
  validacion: 'Validación',
};

function validateExecuteAction(
  status: ProcessStatus | undefined,
  action: string,
  columnId: string
): { valid: boolean; reason?: string } {
  if (!status) return { valid: false, reason: `${COLUMN_LABELS[columnId] ?? columnId} no tiene datos` };

  switch (action) {
    case 'Segregación Automática de Mediciones':
      if (status === 'error' || status === 'in-progress')
        return { valid: false, reason: `${COLUMN_LABELS[columnId]} está en ${status === 'error' ? 'error' : 'progreso'}` };
      break;
    case 'Validación Automática de Oferta':
      if (status === 'error')
        return { valid: false, reason: `${COLUMN_LABELS[columnId]} tiene error` };
      break;
    case 'Ejecución de Tablas MEM':
      if (status !== 'success')
        return { valid: false, reason: `${COLUMN_LABELS[columnId]} no está completado` };
      break;
    case 'Validación de ECyP':
      if (status === 'error')
        return { valid: false, reason: `${COLUMN_LABELS[columnId]} tiene error` };
      break;
    case 'Revisión':
      if (status !== 'success')
        return { valid: false, reason: `${COLUMN_LABELS[columnId]} no está completado` };
      break;
  }
  return { valid: true };
}

function validateDeleteAction(
  status: ProcessStatus | undefined,
  columnId: string
): { valid: boolean; reason?: string } {
  if (status === 'in-progress')
    return { valid: false, reason: `${COLUMN_LABELS[columnId] ?? columnId} está en progreso` };
  return { valid: true };
}

export function validateSubcuentasForActions(
  subcuentas: SubcuentaData[],
  selectedIds: Set<string>,
  actions: Set<string>,
  mode: 'execute' | 'delete'
): ValidationResult[] {
  const selected = subcuentas.filter((s) => selectedIds.has(s.id));

  return selected.map((sub) => {
    const reasons: string[] = [];

    for (const action of actions) {
      const columnId = ACTION_COLUMN_MAP[action];
      if (!columnId) continue;

      const colData = sub.columns[columnId];
      const status = colData?.status;

      const result =
        mode === 'execute'
          ? validateExecuteAction(status, action, columnId)
          : validateDeleteAction(status, columnId);

      if (!result.valid && result.reason) {
        reasons.push(result.reason);
      }
    }

    return {
      subcuentaId: sub.id,
      subcuentaCode: sub.code,
      isValid: reasons.length === 0,
      reason: reasons.length > 0 ? reasons.join(', ') : undefined,
    };
  });
}

export const getStatusTooltip = (status: StatusType): string => {
  const tooltips: Record<StatusType, string> = {
    success: 'Enviado correctamente',
    pending: 'Esperando procesamiento',
    'in-progress': 'Procesando datos...',
    error: 'Error en el procesamiento',
  };
  return tooltips[status];
};

export const getProgressPercentage = (total: number, completed: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
