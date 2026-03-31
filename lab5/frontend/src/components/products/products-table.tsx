import Link from 'next/link';
import { DeleteProductButton } from '@/components/products/delete-product-button';
import type { Product } from '@/types/product';

type ProductsTableProps = {
  products: Product[];
  canEdit: boolean;
  canDelete: boolean;
  onDeleted: (deletedProduct: Product) => void | Promise<void>;
};

const currencyFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  minimumFractionDigits: 2,
});

export function ProductsTable({
  products,
  canEdit,
  canDelete,
  onDeleted,
}: ProductsTableProps) {
  return (
    <div className="table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>SKU</th>
            <th>Категорія</th>
            <th>Постачальник</th>
            <th>Од. виміру</th>
            <th>Ціна</th>
            <th>Кількість</th>
            <th>Мін. кількість</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="table-primary">{product.name}</div>
                {product.description ? (
                  <div className="table-secondary">{product.description}</div>
                ) : null}
              </td>
              <td>{product.sku}</td>
              <td>{product.category.name}</td>
              <td>{product.supplier.name}</td>
              <td>
                {product.unit.name} ({product.unit.short_name})
              </td>
              <td>{currencyFormatter.format(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{product.min_quantity}</td>
              <td>
                <div className="table-actions">
                  <Link href={`/products/${product.id}`} className="outline-link compact-link">
                    Деталі
                  </Link>
                  {canEdit ? (
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="outline-link compact-link"
                    >
                      Редагувати
                    </Link>
                  ) : null}
                  {canDelete ? (
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                      onDeleted={onDeleted}
                    />
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
