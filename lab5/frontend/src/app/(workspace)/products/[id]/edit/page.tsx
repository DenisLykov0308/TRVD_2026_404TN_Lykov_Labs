'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminOnly } from '@/components/auth/admin-only';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ProductForm } from '@/components/products/product-form';
import { ApiClientError } from '@/services/api/client';
import { ProductService } from '@/services/api/products.service';
import type { Product } from '@/types/product';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
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
          setErrorMessage('Не вдалося завантажити товар для редагування.');
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

  if (errorMessage) {
    return (
      <section className="workspace-panel">
        <div className="error-message">{errorMessage}</div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="workspace-panel">
        <LoadingSpinner label="Завантажуємо товар для редагування..." />
      </section>
    );
  }

  if (!product) {
    return (
      <section className="workspace-panel">
        <div className="empty-state">Товар не знайдено.</div>
      </section>
    );
  }

  return (
    <AdminOnly backHref={`/products/${product.id}`}>
      <ProductForm mode="edit" initialProduct={product} />
    </AdminOnly>
  );
}
