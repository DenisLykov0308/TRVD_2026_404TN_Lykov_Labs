export type EntityReference = {
  id: number;
  name: string;
};

export type UnitReference = {
  id: number;
  name: string;
  short_name: string;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  quantity: number;
  min_quantity: number;
  category: EntityReference;
  supplier: EntityReference;
  unit: UnitReference;
};

export type ProductListParams = {
  search?: string;
};

export type ProductPayload = {
  name: string;
  sku: string;
  description?: string;
  category_id: number;
  supplier_id: number;
  unit_id: number;
  price: number;
  quantity?: number;
  min_quantity?: number;
};
