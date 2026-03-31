'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { ApiClientError } from '@/services/api/client';
import { CustomersService } from '@/services/api/customers.service';
import type { Customer } from '@/types/reference';

export default function CustomerDetailsPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
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
          setErrorMessage('Не вдалося завантажити картку клієнта.');
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

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Customers</p>
          <h1>Картка клієнта</h1>
          <p>Інформація про клієнта використовується в документах відвантаження та журналi операцій.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/customers" className="outline-link">
            До списку клієнтів
          </Link>
          {customer && isAdminRole(user?.role) ? (
            <Link href={`/customers/${customer.id}/edit`} className="primary-button">
              Редагувати
            </Link>
          ) : null}
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо картку клієнта..." />
      ) : customer ? (
        <div className="details-grid">
          <article className="details-card">
            <h2>Основні дані</h2>
            <dl className="details-list">
              <div className="details-item">
                <dt>Назва</dt>
                <dd>{customer.name}</dd>
              </div>
              <div className="details-item">
                <dt>Контактна особа</dt>
                <dd>{customer.contact_person || '—'}</dd>
              </div>
              <div className="details-item">
                <dt>Телефон</dt>
                <dd>{customer.phone || '—'}</dd>
              </div>
            </dl>
          </article>
          <article className="details-card">
            <h2>Комунікація</h2>
            <dl className="details-list">
              <div className="details-item">
                <dt>Email</dt>
                <dd>{customer.email || '—'}</dd>
              </div>
              <div className="details-item">
                <dt>Адреса</dt>
                <dd>{customer.address || '—'}</dd>
              </div>
            </dl>
          </article>
        </div>
      ) : (
        <div className="empty-state">Клієнта не знайдено.</div>
      )}
    </section>
  );
}
