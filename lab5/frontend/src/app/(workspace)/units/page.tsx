'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DeleteActionButton } from '@/components/common/delete-action-button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { ApiClientError } from '@/services/api/client';
import { UnitsService } from '@/services/api/units.service';
import type { Unit } from '@/types/reference';

export default function UnitsPage() {
  const { user } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isAdmin = isAdminRole(user?.role);

  useEffect(() => {
    let isMounted = true;

    async function loadUnits() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await UnitsService.getUnits();
        if (isMounted) {
          setUnits(response);
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
          setErrorMessage('Не вдалося завантажити довідник одиниць виміру.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUnits();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(deletedUnit: Unit) {
    setUnits((currentState) => currentState.filter((unit) => unit.id !== deletedUnit.id));
    setSuccessMessage(`Одиницю "${deletedUnit.name}" успішно видалено.`);
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Units</p>
          <h1>Одиниці виміру</h1>
          <p>Довідник одиниць виміру використовується в товарах, надходженнях та відвантаженнях.</p>
        </div>

        <div className="toolbar-actions">
          {isAdmin ? (
            <Link href="/units/create" className="primary-button">
              Додати одиницю
            </Link>
          ) : null}
        </div>
      </div>

      {successMessage ? <div className="success-message">{successMessage}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо довідник одиниць виміру..." />
      ) : units.length > 0 ? (
        <div className="table-wrapper">
          <table className="products-table directory-table">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Коротке позначення</th>
                {isAdmin ? <th>Дії</th> : null}
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td>{unit.name}</td>
                  <td>{unit.short_name}</td>
                  {isAdmin ? (
                    <td>
                      <div className="table-actions">
                        <Link href={`/units/${unit.id}/edit`} className="outline-link compact-link">
                          Редагувати
                        </Link>
                        <DeleteActionButton
                          entityLabel="одиницю виміру"
                          confirmMessage={`Ви дійсно хочете видалити одиницю "${unit.name}"?`}
                          onDelete={() => UnitsService.deleteUnit(unit.id)}
                          onDeleted={handleDeleted}
                        />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          {isAdmin
            ? 'Довідник одиниць виміру порожній. Додайте перший запис.'
            : 'Одиниці виміру ще не додані адміністратором.'}
        </div>
      )}
    </section>
  );
}
