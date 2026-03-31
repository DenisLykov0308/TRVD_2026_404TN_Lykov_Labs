export type WarehouseUserSummary = {
  id: number;
  email: string;
  full_name: string;
};

export type ProductSummary = {
  id: number;
  name: string;
  sku: string;
};

export type PartySummary = {
  id: number;
  name: string;
};

export type StockDocumentItem = {
  id: number;
  product: ProductSummary;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type StockReceipt = {
  id: number;
  receipt_number: string;
  receipt_date: string;
  status: string;
  total_amount: number;
  comment: string | null;
  supplier: PartySummary;
  created_by: WarehouseUserSummary;
  items: StockDocumentItem[];
};

export type StockReceiptPayloadItem = {
  product_id: number;
  quantity: number;
  unit_price: number;
};

export type StockReceiptPayload = {
  receipt_number: string;
  supplier_id: number;
  created_by: number;
  receipt_date: string;
  status?: string;
  comment?: string;
  items: StockReceiptPayloadItem[];
};

export type StockShipment = {
  id: number;
  shipment_number: string;
  shipment_date: string;
  status: string;
  total_amount: number;
  comment: string | null;
  customer: PartySummary;
  created_by: WarehouseUserSummary;
  items: StockDocumentItem[];
};

export type StockShipmentPayloadItem = {
  product_id: number;
  quantity: number;
  unit_price: number;
};

export type StockShipmentPayload = {
  shipment_number: string;
  customer_id: number;
  created_by: number;
  shipment_date: string;
  status?: string;
  comment?: string;
  items: StockShipmentPayloadItem[];
};

export type InventoryTransaction = {
  id: number;
  transaction_type: 'IN' | 'OUT';
  quantity: number;
  reference_type: string;
  reference_id: number;
  comment: string | null;
  product: ProductSummary;
  created_by: WarehouseUserSummary;
  transaction_date: string;
};

export type InventoryTransactionsQuery = {
  product_id?: number;
};
