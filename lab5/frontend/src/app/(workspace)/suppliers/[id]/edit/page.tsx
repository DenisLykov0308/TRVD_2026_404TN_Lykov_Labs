'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminOnly } from '@/components/auth/admin-only';
import { SupplierForm } from '@/components/catalog/supplier-form';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ApiClientError } from '@/services/api/client';
import { SuppliersService } from '@/services/api/suppliers.service';
import type { Supplier } from '@/types/reference';

export default function EditSupplierPage() {
  const params = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSupplier() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id < 1) {
        setErrorMessage('Некоректний ідентифікатор постачальника.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await SuppliersService.getSupplierById(id);
        if (isMounted) {
          setSupplier(response);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiClientError) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Не вдалося завантажити постачальника для редагування.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSupplier();

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
        <LoadingSpinner label="Завантажуємо постачальника для редагування..." />
      </section>
    );
  }

  if (!supplier) {
    return (
      <section className="workspace-panel">
        <div className="empty-state">Постачальника не знайдено.</div>
      </section>
    );
  }

  return (
    <AdminOnly backHref={`/suppliers/${supplier.id}`}>
      <SupplierForm mode="edit" initialSupplier={supplier} />
    </AdminOnly>
  );
}
