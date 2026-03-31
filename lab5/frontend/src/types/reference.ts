export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type CategoryPayload = {
  name: string;
  description?: string;
};

export type Supplier = {
  id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
};

export type SupplierPayload = {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type Customer = {
  id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
};

export type CustomerPayload = {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type Unit = {
  id: number;
  name: string;
  short_name: string;
};

export type UnitPayload = {
  name: string;
  short_name: string;
};
