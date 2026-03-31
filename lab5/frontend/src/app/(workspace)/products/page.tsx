'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ProductsTable } from '@/components/products/products-table';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { ApiClientError } from '@/services/api/client';
import { ProductService } from '@/services/api/products.service';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await ProductService.getProducts();

        if (!isMounted) {
          return;
        }

        setProducts(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiClientError) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Не вдалося завантажити список товарів.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(deletedProduct: Product) {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== deletedProduct.id),
    );
    setSuccessMessage(`Товар "${deletedProduct.name}" успішно видалено.`);
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Products</p>
          <h1>Товари складу</h1>
          <p>
            Основний CRUD UI реалізовано для товарів поверх уже існуючих
            endpoint&apos;ів backend API.
          </p>
        </div>

        <div className="toolbar-actions">
          {isAdminRole(user?.role) ? (
            <Link href="/products/create" className="primary-button">
              Додати товар
            </Link>
          ) : null}
        </div>
      </div>

      {successMessage ? <div className="success-message">{successMessage}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо список товарів..." />
      ) : products.length > 0 ? (
        <ProductsTable
          products={products}
          canEdit={isAdminRole(user?.role)}
          canDelete={isAdminRole(user?.role)}
          onDeleted={handleDeleted}
        />
      ) : (
        <div className="empty-state">
          {isAdminRole(user?.role)
            ? 'У системі ще немає товарів. Створіть перший запис через форму додавання.'
            : 'У системі ще немає товарів або вони ще не були заведені адміністратором.'}
        </div>
      )}
    </section>
  );
}
