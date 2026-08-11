export interface DashboardSummary {
  totals: {
    customers: number;
    activeCustomers: number;
    products: number;
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    current_stock: number;
    min_stock_alert: number;
  }>;
  challanCounts: Record<string, number>;
  recentActivity: Array<{
    type: string;
    created_at: string;
    title: string;
    subtitle: string;
  }>;
}

