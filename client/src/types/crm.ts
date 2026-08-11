export type CustomerStatus = 'LEAD' | 'ACTIVE' | 'INACTIVE';
export type CustomerType = 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  business_name: string;
  gst_number: string | null;
  customer_type: CustomerType;
  address: string;
  status: CustomerStatus;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFollowup {
  id: string;
  customer_id: string;
  note: string;
  follow_up_date: string | null;
  created_by_name?: string;
  created_at: string;
}

export interface CustomerDetail extends Customer {
  followups: CustomerFollowup[];
}

