'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Customer } from '@/types/reference';
import { ApiClientError } from '@/services/api/client';
import { CustomersService } from '@/services/api/customers.service';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CustomerFormProps = {
  mode: 'create' | 'edit';
  initialCustomer?: Customer | null;
};

export function CustomerForm({
  mode,
  initialCustomer = null,
}: CustomerFormProps) {
  const [formState, setFormState] = useState({
    name: initialCustomer?.name ?? '',
    contact_person: initialCustomer?.contact_person ?? '',
    phone: initialCustomer?.phone ?? '',
    email: initialCustomer?.email ?? '',
    address: initialCustomer?.address ?? '',
  });
  const [savedCustomer, setSavedCustomer] = useState<Customer | null>(initialCustomer);
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
      setErrorMessage('Вкажіть назву клієнта.');
      return;
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      setErrorMessage('Вкажіть коректну email-адресу клієнта.');
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
          ? await CustomersService.createCustomer(payload)
          : await CustomersService.updateCustomer(initialCustomer!.id, payload);

      setSavedCustomer(result);
      setFormState({
        name: result.name,
        contact_person: result.contact_person ?? '',
        phone: result.phone ?? '',
        email: result.email ?? '',
        address: result.address ?? '',
      });
      setSuccessMessage(
        mode === 'create'
          ? 'Клієнта успішно створено.'
          : 'Зміни до клієнта успішно збережено.',
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося зберегти клієнта.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Customers</p>
          <h1>{mode === 'create' ? 'Створення клієнта' : 'Редагування клієнта'}</h1>
          <p>Картка клієнта використовується в модулях відвантаження та довідниках складської системи.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/customers" className="outline-link">
            До списку клієнтів
          </Link>
          {savedCustomer ? (
            <Link href={`/customers/${savedCustomer.id}`} className="outline-link">
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
            <span>Назва клієнта</span>
            <input
              type="text"
              value={formState.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="ТОВ Рітейл Центр"
            />
          </label>

          <label className="form-field">
            <span>Контактна особа</span>
            <input
              type="text"
              value={formState.contact_person}
              onChange={(event) => updateField('contact_person', event.target.value)}
              placeholder="Олена Коваль"
            />
          </label>

          <label className="form-field">
            <span>Телефон</span>
            <input
              type="text"
              value={formState.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+380671234567"
            />
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={formState.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="office@example.com"
            />
          </label>

          <label className="form-field form-field-wide">
            <span>Адреса</span>
            <textarea
              value={formState.address}
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="м. Львів, вул. Галицька, 8"
              rows={4}
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Створюємо клієнта...'
                : 'Зберігаємо зміни...'
              : mode === 'create'
                ? 'Створити клієнта'
                : 'Зберегти зміни'}
          </button>
          <Link href="/customers" className="outline-link">
            Скасувати
          </Link>
        </div>
      </form>
    </section>
  );
}
