import { AdminOnly } from '@/components/auth/admin-only';
import { UnitForm } from '@/components/catalog/unit-form';

export default function CreateUnitPage() {
  return (
    <AdminOnly backHref="/units">
      <UnitForm mode="create" />
    </AdminOnly>
  );
}
