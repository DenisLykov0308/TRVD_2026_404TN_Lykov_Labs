'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminOnly } from '@/components/auth/admin-only';
import { CustomerForm } from '@/components/catalog/customer-form';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ApiClientError } from '@/services/api/client';
import { CustomersService } from '@/services/api/customers.service';
import type { Customer } from '@/types/reference';

export default function EditCustomerPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCustomer() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id < 1) {
        setErrorMessage('Некоректний ідентифікатор клієнта.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await CustomersService.getCustomerById(id);
        if (isMounted) {
          setCustomer(response);
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
          setErrorMessage('Не вдалося завантажити клієнта для редагування.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCustomer();

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
        <LoadingSpinner label="Завантажуємо клієнта для редагування..." />
      </section>
    );
  }

  if (!customer) {
    return (
      <section className="workspace-panel">
        <div className="empty-state">Клієнта не знайдено.</div>
      </section>
    );
  }

  return (
    <AdminOnly backHref={`/customers/${customer.id}`}>
      <CustomerForm mode="edit" initialCustomer={customer} />
    </AdminOnly>
  );
}
