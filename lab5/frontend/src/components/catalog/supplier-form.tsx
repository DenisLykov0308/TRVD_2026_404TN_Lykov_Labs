'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Supplier } from '@/types/reference';
import { ApiClientError } from '@/services/api/client';
import { SuppliersService } from '@/services/api/suppliers.service';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SupplierFormProps = {
  mode: 'create' | 'edit';
  initialSupplier?: Supplier | null;
};

export function SupplierForm({
  mode,
  initialSupplier = null,
}: SupplierFormProps) {
  const [formState, setFormState] = useState({
    name: initialSupplier?.name ?? '',
    contact_person: initialSupplier?.contact_person ?? '',
    phone: initialSupplier?.phone ?? '',
    email: initialSupplier?.email ?? '',
    address: initialSupplier?.address ?? '',
  });
  const [savedSupplier, setSavedSupplier] = useState<Supplier | null>(initialSupplier);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof formState, value: string) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const name = formState.name.trim();
    const email = formState.email.trim();

    if (!name) {
      setErrorMessage('Вкажіть назву постачальника.');
      return;
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      setErrorMessage('Вкажіть коректну email-адресу постачальника.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        contact_person: formState.contact_person.trim() || undefined,
        phone: formState.phone.trim() || undefined,
        email: email || undefined,
        address: formState.address.trim() || undefined,
      };

      const result =
        mode === 'create'
          ? await SuppliersService.createSupplier(payload)
          : await SuppliersService.updateSupplier(initialSupplier!.id, payload);

      setSavedSupplier(result);
      setFormState({
        name: result.name,
        contact_person: result.contact_person ?? '',
        phone: result.phone ?? '',
        email: result.email ?? '',
        address: result.address ?? '',
      });
      setSuccessMessage(
        mode === 'create'
          ? 'Постачальника успішно створено.'
          : 'Зміни до постачальника успішно збережено.',
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося зберегти постачальника.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Suppliers</p>
          <h1>{mode === 'create' ? 'Створення постачальника' : 'Редагування постачальника'}</h1>
          <p>У картці постачальника доступні лише поля, які реально підтримує backend API.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/suppliers" className="outline-link">
            До списку постачальників
          </Link>
          {savedSupplier ? (
            <Link href={`/suppliers/${savedSupplier.id}`} className="outline-link">
              Переглянути картку
            </Link>
          ) : null}
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
      {successMessage ? <div className="success-message">{successMessage}</div> : null}

      <form className="auth-form product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Назва постачальника</span>
            <input
              type="text"
              value={formState.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="ТОВ ТехноПостач"
            />
          </label>

          <label className="form-field">
            <span>Контактна особа</span>
            <input
              type="text"
              value={formState.contact_person}
              onChange={(event) => updateField('contact_person', event.target.value)}
              placeholder="Іван Петренко"
            />
          </label>

          <label className="form-field">
            <span>Телефон</span>
            <input
              type="text"
              value={formState.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+380501112233"
            />
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={formState.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="sales@example.com"
            />
          </label>

          <label className="form-field form-field-wide">
            <span>Адреса</span>
            <textarea
              value={formState.address}
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="м. Київ, вул. Центральна, 10"
              rows={4}
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Створюємо постачальника...'
                : 'Зберігаємо зміни...'
              : mode === 'create'
                ? 'Створити постачальника'
                : 'Зберегти зміни'}
          </button>
          <Link href="/suppliers" className="outline-link">
            Скасувати
          </Link>
        </div>
      </form>
    </section>
  );
}
