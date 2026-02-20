export type StatusType = 'success' | 'pending' | 'error' | 'in-progress';

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
