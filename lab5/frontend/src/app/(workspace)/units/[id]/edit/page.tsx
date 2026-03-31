'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminOnly } from '@/components/auth/admin-only';
import { UnitForm } from '@/components/catalog/unit-form';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ApiClientError } from '@/services/api/client';
import { UnitsService } from '@/services/api/units.service';
import type { Unit } from '@/types/reference';

export default function EditUnitPage() {
  const params = useParams<{ id: string }>();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadUnit() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id < 1) {
        setErrorMessage('Некоректний ідентифікатор одиниці виміру.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await UnitsService.getUnitById(id);
        if (isMounted) {
          setUnit(response);
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
          setErrorMessage('Не вдалося завантажити одиницю виміру для редагування.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUnit();

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
        <LoadingSpinner label="Завантажуємо одиницю виміру для редагування..." />
      </section>
    );
  }

  if (!unit) {
    return (
      <section className="workspace-panel">
        <div className="empty-state">Одиницю виміру не знайдено.</div>
      </section>
    );
  }

  return (
    <AdminOnly backHref="/units">
      <UnitForm mode="edit" initialUnit={unit} />
    </AdminOnly>
  );
}
