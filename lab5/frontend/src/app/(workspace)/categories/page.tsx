'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DeleteActionButton } from '@/components/common/delete-action-button';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { CategoriesService } from '@/services/api/categories.service';
import { ApiClientError } from '@/services/api/client';
import type { Category } from '@/types/reference';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isAdmin = isAdminRole(user?.role);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await CategoriesService.getCategories();
        if (isMounted) {
          setCategories(response);
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
          setErrorMessage('Не вдалося завантажити довідник категорій.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(deletedCategory: Category) {
    setCategories((currentState) =>
      currentState.filter((category) => category.id !== deletedCategory.id),
    );
    setSuccessMessage(`Категорію "${deletedCategory.name}" успішно видалено.`);
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Categories</p>
          <h1>Довідник категорій</h1>
          <p>Категорії використовуються у картках товарів і допомагають структурувати номенклатуру складу.</p>
        </div>

        <div className="toolbar-actions">
          {isAdmin ? (
            <Link href="/categories/create" className="primary-button">
              Додати категорію
            </Link>
          ) : null}
        </div>
      </div>

      {successMessage ? <div className="success-message">{successMessage}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо довідник категорій..." />
      ) : categories.length > 0 ? (
        <div className="table-wrapper">
          <table className="products-table directory-table">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Опис</th>
                {isAdmin ? <th>Дії</th> : null}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="table-primary">{category.name}</div>
                  </td>
                  <td>{category.description || '—'}</td>
                  {isAdmin ? (
                    <td>
                      <div className="table-actions">
                        <Link
                          href={`/categories/${category.id}/edit`}
                          className="outline-link compact-link"
                        >
                          Редагувати
                        </Link>
                        <DeleteActionButton
                          entityLabel="категорію"
                          confirmMessage={`Ви дійсно хочете видалити категорію "${category.name}"?`}
                          onDelete={() => CategoriesService.deleteCategory(category.id)}
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
            ? 'Довідник категорій порожній. Додайте першу категорію.'
            : 'Категорії ще не додані адміністратором.'}
        </div>
      )}
    </section>
  );
}
