import { AdminOnly } from '@/components/auth/admin-only';
import { CustomerForm } from '@/components/catalog/customer-form';

export default function CreateCustomerPage() {
  return (
    <AdminOnly backHref="/customers">
      <CustomerForm mode="create" />
    </AdminOnly>
  );
}
