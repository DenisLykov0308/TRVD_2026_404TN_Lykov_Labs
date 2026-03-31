'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Unit } from '@/types/reference';
import { ApiClientError } from '@/services/api/client';
import { UnitsService } from '@/services/api/units.service';

type UnitFormProps = {
  mode: 'create' | 'edit';
  initialUnit?: Unit | null;
};

export function UnitForm({
  mode,
  initialUnit = null,
}: UnitFormProps) {
  const [name, setName] = useState(initialUnit?.name ?? '');
  const [shortName, setShortName] = useState(initialUnit?.short_name ?? '');
  const [savedUnit, setSavedUnit] = useState<Unit | null>(initialUnit);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = name.trim();
    const trimmedShortName = shortName.trim();

    if (!trimmedName || !trimmedShortName) {
      setErrorMessage('Заповніть назву та коротке позначення одиниці виміру.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: trimmedName,
        short_name: trimmedShortName,
      };

      const result =
        mode === 'create'
          ? await UnitsService.createUnit(payload)
          : await UnitsService.updateUnit(initialUnit!.id, payload);

      setSavedUnit(result);
      setName(result.name);
      setShortName(result.short_name);
      setSuccessMessage(
        mode === 'create'
          ? 'Одиницю виміру успішно створено.'
          : 'Зміни до одиниці виміру успішно збережено.',
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося зберегти одиницю виміру.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Units</p>
          <h1>{mode === 'create' ? 'Створення одиниці виміру' : 'Редагування одиниці виміру'}</h1>
          <p>Цей довідник використовується у формах товарів і складських документів.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/units" className="outline-link">
            До списку одиниць
          </Link>
          {savedUnit ? <span className="helper-text">ID: {savedUnit.id}</span> : null}
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
      {successMessage ? <div className="success-message">{successMessage}</div> : null}

      <form className="auth-form product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Назва одиниці</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Штука"
            />
          </label>

          <label className="form-field">
            <span>Коротке позначення</span>
            <input
              type="text"
              value={shortName}
              onChange={(event) => setShortName(event.target.value)}
              placeholder="шт"
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Створюємо одиницю...'
                : 'Зберігаємо зміни...'
              : mode === 'create'
                ? 'Створити одиницю'
                : 'Зберегти зміни'}
          </button>
          <Link href="/units" className="outline-link">
            Скасувати
          </Link>
        </div>
      </form>
    </section>
  );
}
