'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { ApiClientError } from '@/services/api/client';
import { SuppliersService } from '@/services/api/suppliers.service';
import type { Supplier } from '@/types/reference';

export default function SupplierDetailsPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
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
          setErrorMessage('Не вдалося завантажити картку постачальника.');
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

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Suppliers</p>
          <h1>Картка постачальника</h1>
          <p>Повна інформація про контрагента, який використовується у документах надходження.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/suppliers" className="outline-link">
            До списку постачальників
          </Link>
          {supplier && isAdminRole(user?.role) ? (
            <Link href={`/suppliers/${supplier.id}/edit`} className="primary-button">
              Редагувати
            </Link>
          ) : null}
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо картку постачальника..." />
      ) : supplier ? (
        <div className="details-grid">
          <article className="details-card">
            <h2>Основні дані</h2>
            <dl className="details-list">
              <div className="details-item">
                <dt>Назва</dt>
                <dd>{supplier.name}</dd>
              </div>
              <div className="details-item">
                <dt>Контактна особа</dt>
                <dd>{supplier.contact_person || '—'}</dd>
              </div>
              <div className="details-item">
                <dt>Телефон</dt>
                <dd>{supplier.phone || '—'}</dd>
              </div>
            </dl>
          </article>
          <article className="details-card">
            <h2>Комунікація</h2>
            <dl className="details-list">
              <div className="details-item">
                <dt>Email</dt>
                <dd>{supplier.email || '—'}</dd>
              </div>
              <div className="details-item">
                <dt>Адреса</dt>
                <dd>{supplier.address || '—'}</dd>
              </div>
            </dl>
          </article>
        </div>
      ) : (
        <div className="empty-state">Постачальника не знайдено.</div>
      )}
    </section>
  );
}
