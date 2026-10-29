import {
  User,
  Warehouse,
  StoredProduct,
  CargoMovement,
  Tariff,
  CustomsService,
  ContractPayer,
  ProductEditLog
} from './types';

export interface MonthlyActivityReport {
  userName: string;
  userRole: string;
  inCount: number;
  outCount: number;
  totalOperations: number;
  inQuantity: number;
  outQuantity: number;
  inWeightKg: number;
  outWeightKg: number;
  totalInAmount: number;
  totalOutAmount: number;
  totalAmount: number;
  uniqueProductsIn: number;
  uniqueProductsOut: number;
  uniqueClientsIn: number;
  uniqueClientsOut: number;
  dailyActivity: { date: string; in: number; out: number }[];
}

export interface MonthlyActivitySummary {
  month: string;
  totalUsers: number;
  totalInOperations: number;
  totalOutOperations: number;
  totalOperations: number;
  totalInQuantity: number;
  totalOutQuantity: number;
  totalInWeightKg: number;
  totalOutWeightKg: number;
  totalInAmount: number;
  totalOutAmount: number;
  totalAmount: number;
}

// Standart fetch wrapper
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('uzw_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Noma\'lum xatolik' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    checkSetup: async () => {
      return request<{ needsSetup: boolean; userCount: number }>('/api/auth/setup');
    },
    setupSuperAdmin: async (fullName: string, email: string, password: string) => {
      const data = await request<{ success: boolean; user: User; token: string }>('/api/auth/setup', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password })
      });
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('uzw_token', data.token);
      }
      return data;
    },
    login: async (email: string, password: string) => {
      const data = await request<{ success: boolean; user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('uzw_token', data.token);
      }
      return data;
    },
    me: async () => {
      return request<{ user: User | null }>('/api/auth/me');
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('uzw_token');
        localStorage.removeItem('uzw_active_user');
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      }
    }
  },

  warehouse: {
    get: async () => {
      return request<{ warehouse: Warehouse }>('/api/warehouse');
    },
    update: async (warehouse: Partial<Warehouse> & { sector?: any }) => {
      return request<{ warehouse: Warehouse }>('/api/warehouse', {
        method: 'PUT',
        body: JSON.stringify(warehouse)
      });
    },
    upsertSector: async (sector: any, warehouseId = 'wh-main') => {
      return request<{ warehouse: Warehouse }>('/api/warehouse', {
        method: 'PUT',
        body: JSON.stringify({ id: warehouseId, sector })
      });
    }
  },

  products: {
    getAll: async () => {
      return request<{ products: StoredProduct[] }>('/api/products');
    },
    create: async (data: any) => {
      return request<{ success: boolean; product: StoredProduct; movement: CargoMovement }>('/api/products', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    exit: async (exitData: any) => {
      return request<{
        success: boolean;
        product: StoredProduct | null;
        movement: CargoMovement;
        isFullyExited: boolean;
      }>('/api/products/exit', {
        method: 'POST',
        body: JSON.stringify(exitData)
      });
    },
    update: async (id: string, data: any) => {
      return request<{ success?: boolean; product: StoredProduct; editLog?: ProductEditLog }>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean }>(`/api/products/${id}`, {
        method: 'DELETE'
      });
    }
  },

  payers: {
    getAll: async () => {
      return request<{ payers: ContractPayer[] }>('/api/payers');
    },
    create: async (data: Partial<ContractPayer>) => {
      return request<{ payer: ContractPayer }>('/api/payers', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (id: string, data: Partial<ContractPayer>) => {
      return request<{ payer: ContractPayer }>(`/api/payers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean }>(`/api/payers/${id}`, {
        method: 'DELETE'
      });
    }
  },

  tariffs: {
    getAll: async () => {
      return request<{ tariffs: Tariff[] }>('/api/tariffs');
    },
    create: async (data: Partial<Tariff>) => {
      return request<{ tariff: Tariff }>('/api/tariffs', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (data: Partial<Tariff>) => {
      return request<{ tariff: Tariff }>('/api/tariffs', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  },

  customsServices: {
    getAll: async () => {
      return request<{ services: CustomsService[] }>('/api/customs-services');
    },
    create: async (data: Partial<CustomsService>) => {
      return request<{ service: CustomsService }>('/api/customs-services', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (data: Partial<CustomsService>) => {
      return request<{ service: CustomsService }>('/api/customs-services', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  },

  movements: {
    getAll: async () => {
      return request<{ movements: CargoMovement[] }>('/api/movements');
    },
    updatePayment: async (id: string, paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE') => {
      return request<{ movement: CargoMovement }>('/api/movements', {
        method: 'PUT',
        body: JSON.stringify({ id, paymentStatus })
      });
    }
  },

  users: {
    getAll: async () => {
      return request<{ users: User[] }>('/api/users');
    },
    create: async (data: Partial<User>) => {
      return request<{ user: User }>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (id: string, data: Partial<User>) => {
      return request<{ user: User }>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean }>(`/api/users/${id}`, {
        method: 'DELETE'
      });
    }
  },

  reports: {
    getMonthlyActivity: async (month?: string) => {
      const params = month ? `?month=${month}` : '';
      return request<{ report: MonthlyActivityReport[]; summary: MonthlyActivitySummary }>(`/api/reports/monthly-activity${params}`);
    }
  },

  editLogs: {
    getAll: async () => {
      return request<{ editLogs: ProductEditLog[] }>('/api/edit-logs');
    }
  }
};

