'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DeleteActionButton } from '@/components/common/delete-action-button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { ApiClientError } from '@/services/api/client';
import { CustomersService } from '@/services/api/customers.service';
import type { Customer } from '@/types/reference';

export default function CustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isAdmin = isAdminRole(user?.role);

  useEffect(() => {
    let isMounted = true;

    async function loadCustomers() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await CustomersService.getCustomers();
        if (isMounted) {
          setCustomers(response);
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
          setErrorMessage('Не вдалося завантажити список клієнтів.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(deletedCustomer: Customer) {
    setCustomers((currentState) =>
      currentState.filter((customer) => customer.id !== deletedCustomer.id),
    );
    setSuccessMessage(`Клієнта "${deletedCustomer.name}" успішно видалено.`);
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Customers</p>
          <h1>Клієнти</h1>
          <p>Переглядайте клієнтів, які використовуються в документах відвантаження, і відкривайте їхні картки.</p>
        </div>

        <div className="toolbar-actions">
          {isAdmin ? (
            <Link href="/customers/create" className="primary-button">
              Додати клієнта
            </Link>
          ) : null}
        </div>
      </div>

      {successMessage ? <div className="success-message">{successMessage}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо список клієнтів..." />
      ) : customers.length > 0 ? (
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
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="table-primary">{customer.name}</div>
                    <div className="table-secondary">{customer.contact_person || 'Без контактної особи'}</div>
                  </td>
                  <td>
                    <div>{customer.phone || '—'}</div>
                    <div className="table-secondary">{customer.email || '—'}</div>
                  </td>
                  <td>{customer.address || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/customers/${customer.id}`} className="outline-link compact-link">
                        Деталі
                      </Link>
                      {isAdmin ? (
                        <Link
                          href={`/customers/${customer.id}/edit`}
                          className="outline-link compact-link"
                        >
                          Редагувати
                        </Link>
                      ) : null}
                      {isAdmin ? (
                        <DeleteActionButton
                          entityLabel="клієнта"
                          confirmMessage={`Ви дійсно хочете видалити клієнта "${customer.name}"?`}
                          onDelete={() => CustomersService.deleteCustomer(customer.id)}
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
            ? 'Клієнтів поки не додано. Створіть перший запис.'
            : 'Список клієнтів поки порожній.'}
        </div>
      )}
    </section>
  );
}
