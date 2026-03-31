'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ProductDetails } from '@/components/products/product-details';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { ApiClientError } from '@/services/api/client';
import { ProductService } from '@/services/api/products.service';
import type { Product } from '@/types/product';

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id < 1) {
        setErrorMessage('Некоректний ідентифікатор товару.');
        setIsLoading(false);
        return;
      }

      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await ProductService.getProductById(id);

        if (!isMounted) {
          return;
        }

        setProduct(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiClientError) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Не вдалося завантажити деталі товару.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Products</p>
          <h1>Деталі товару</h1>
          <p>Повна інформація про обраний товар із довідковими прив’язками.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/products" className="outline-link">
            До списку товарів
          </Link>
          {product && isAdminRole(user?.role) ? (
            <Link href={`/products/${product.id}/edit`} className="primary-button">
              Редагувати
            </Link>
          ) : null}
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо деталі товару..." />
      ) : product ? (
        <ProductDetails product={product} />
      ) : (
        <div className="empty-state">Товар не знайдено.</div>
      )}
    </section>
  );
}
