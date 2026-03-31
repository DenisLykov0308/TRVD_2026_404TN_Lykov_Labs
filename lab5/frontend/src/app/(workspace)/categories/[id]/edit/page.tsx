'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminOnly } from '@/components/auth/admin-only';
import { CategoryForm } from '@/components/catalog/category-form';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { CategoriesService } from '@/services/api/categories.service';
import { ApiClientError } from '@/services/api/client';
import type { Category } from '@/types/reference';

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id < 1) {
        setErrorMessage('Некоректний ідентифікатор категорії.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await CategoriesService.getCategoryById(id);
        if (isMounted) {
          setCategory(response);
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
          setErrorMessage('Не вдалося завантажити категорію для редагування.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategory();

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
        <LoadingSpinner label="Завантажуємо категорію для редагування..." />
      </section>
    );
  }

  if (!category) {
    return (
      <section className="workspace-panel">
        <div className="empty-state">Категорію не знайдено.</div>
      </section>
    );
  }

  return (
    <AdminOnly backHref="/categories">
      <CategoryForm mode="edit" initialCategory={category} />
    </AdminOnly>
  );
}
