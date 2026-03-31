import { AdminOnly } from '@/components/auth/admin-only';
import { ProductForm } from '@/components/products/product-form';

export default function CreateProductPage() {
  return (
    <AdminOnly backHref="/products">
      <ProductForm mode="create" />
    </AdminOnly>
  );
}
