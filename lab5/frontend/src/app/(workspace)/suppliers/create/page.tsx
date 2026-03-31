import { AdminOnly } from '@/components/auth/admin-only';
import { SupplierForm } from '@/components/catalog/supplier-form';

export default function CreateSupplierPage() {
  return (
    <AdminOnly backHref="/suppliers">
      <SupplierForm mode="create" />
    </AdminOnly>
  );
}
