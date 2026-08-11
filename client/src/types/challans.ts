export type ChallanStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export interface ChallanListItem {
  id: string;
  challan_number: string;
  customer_id: string;
  total_quantity: number;
  status: ChallanStatus;
  business_name: string;
  created_by_name: string;
  created_at: string;
}

export interface ChallanItem {
  id: string;
  challan_id: string;
  product_id: string;
  quantity: number;
  snapshot_product_name: string;
  snapshot_sku: string;
  snapshot_unit_price: string;
}

export interface ChallanDetail {
  challan: {
    id: string;
    challan_number: string;
    customer_id: string;
    total_quantity: number;
    status: ChallanStatus;
    customer_name: string;
    business_name: string;
    mobile: string;
    email: string;
    created_at: string;
    confirmed_at: string | null;
  };
  items: ChallanItem[];
}

