import type { Product } from '@/types/product';

type ProductDetailsProps = {
  product: Product;
};

const currencyFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  minimumFractionDigits: 2,
});

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="details-grid">
      <div className="details-card">
        <h2>Основна інформація</h2>
        <dl className="details-list">
          <div className="details-item">
            <dt>Назва</dt>
            <dd>{product.name}</dd>
          </div>
          <div className="details-item">
            <dt>SKU</dt>
            <dd>{product.sku}</dd>
          </div>
          <div className="details-item">
            <dt>Опис</dt>
            <dd>{product.description || 'Опис не вказано.'}</dd>
          </div>
        </dl>
      </div>

      <div className="details-card">
        <h2>Складські дані</h2>
        <dl className="details-list">
          <div className="details-item">
            <dt>Категорія</dt>
            <dd>{product.category.name}</dd>
          </div>
          <div className="details-item">
            <dt>Постачальник</dt>
            <dd>{product.supplier.name}</dd>
          </div>
          <div className="details-item">
            <dt>Одиниця виміру</dt>
            <dd>
              {product.unit.name} ({product.unit.short_name})
            </dd>
          </div>
          <div className="details-item">
            <dt>Ціна</dt>
            <dd>{currencyFormatter.format(product.price)}</dd>
          </div>
          <div className="details-item">
            <dt>Кількість</dt>
            <dd>{product.quantity}</dd>
          </div>
          <div className="details-item">
            <dt>Мінімальна кількість</dt>
            <dd>{product.min_quantity}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
