import { AdminOnly } from '@/components/auth/admin-only';
import { CategoryForm } from '@/components/catalog/category-form';

export default function CreateCategoryPage() {
  return (
    <AdminOnly backHref="/categories">
      <CategoryForm mode="create" />
    </AdminOnly>
  );
}
