export type ProcessStatus = 'success' | 'pending' | 'error' | 'in-progress';

export interface ProcessColumn {
  id: string;
  label: string;
  description: string;
}

export interface ProcessAction {
  id: string;
  name: string;
  type: 'execute' | 'delete';
  icon: string;
}

export interface ClientData {
  id: string;
  name: string;
  columns: {
    [key: string]: {
      status: ProcessStatus;
      status2?: ProcessStatus;
      lastUpdate?: string;
      executedBy?: string;
      executedBy2?: string;
    };
  };
}

export interface SubcuentaData {
  id: string;
  code: string;
  isExpanded: boolean;
  isSelected: boolean;
  columns: {
    [key: string]: {
      status: ProcessStatus;
      status2?: ProcessStatus;
      lastUpdate?: string;
      executedBy?: string;
      executedBy2?: string;
    };
  };
  clients?: ClientData[];
}

export interface SeparacionECDData {
  startDate: string;
  endDate: string;
  subcuentas: SubcuentaData[];
  progress: number;
}
