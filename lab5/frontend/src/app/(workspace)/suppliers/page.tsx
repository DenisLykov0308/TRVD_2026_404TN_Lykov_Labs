'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DeleteActionButton } from '@/components/common/delete-action-button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { ApiClientError } from '@/services/api/client';
import { SuppliersService } from '@/services/api/suppliers.service';
import type { Supplier } from '@/types/reference';

export default function SuppliersPage() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isAdmin = isAdminRole(user?.role);

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await SuppliersService.getSuppliers();
        if (isMounted) {
          setSuppliers(response);
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
          setErrorMessage('Не вдалося завантажити список постачальників.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(deletedSupplier: Supplier) {
    setSuppliers((currentState) =>
      currentState.filter((supplier) => supplier.id !== deletedSupplier.id),
    );
    setSuccessMessage(`Постачальника "${deletedSupplier.name}" успішно видалено.`);
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Suppliers</p>
          <h1>Постачальники</h1>
          <p>Переглядайте довідник постачальників і переходьте до карток контрагентів, які беруть участь у надходженнях.</p>
        </div>

        <div className="toolbar-actions">
          {isAdmin ? (
            <Link href="/suppliers/create" className="primary-button">
              Додати постачальника
            </Link>
          ) : null}
        </div>
      </div>

      {successMessage ? <div className="success-message">{successMessage}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо постачальників..." />
      ) : suppliers.length > 0 ? (
        <div className="table-wrapper">
          <table className="products-table directory-table">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Контакти</th>
                <th>Адреса</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <div className="table-primary">{supplier.name}</div>
                    <div className="table-secondary">{supplier.contact_person || 'Без контактної особи'}</div>
                  </td>
                  <td>
                    <div>{supplier.phone || '—'}</div>
                    <div className="table-secondary">{supplier.email || '—'}</div>
                  </td>
                  <td>{supplier.address || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/suppliers/${supplier.id}`} className="outline-link compact-link">
                        Деталі
                      </Link>
                      {isAdmin ? (
                        <Link
                          href={`/suppliers/${supplier.id}/edit`}
                          className="outline-link compact-link"
                        >
                          Редагувати
                        </Link>
                      ) : null}
                      {isAdmin ? (
                        <DeleteActionButton
                          entityLabel="постачальника"
                          confirmMessage={`Ви дійсно хочете видалити постачальника "${supplier.name}"?`}
                          onDelete={() => SuppliersService.deleteSupplier(supplier.id)}
                          onDeleted={handleDeleted}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          {isAdmin
            ? 'Постачальників поки не додано. Створіть перший запис.'
            : 'Список постачальників поки порожній.'}
        </div>
      )}
    </section>
  );
}
