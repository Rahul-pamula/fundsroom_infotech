export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit_price: string;
  current_stock: number;
  min_stock_alert: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  movement_type: 'IN' | 'OUT';
  reason: string;
  reference_type: 'CHALLAN' | 'MANUAL_ADJUSTMENT' | 'PURCHASE_ORDER';
  created_by_name: string;
  created_at: string;
}

