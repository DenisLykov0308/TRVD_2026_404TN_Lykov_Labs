'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Category } from '@/types/reference';
import { ApiClientError } from '@/services/api/client';
import { CategoriesService } from '@/services/api/categories.service';

type CategoryFormProps = {
  mode: 'create' | 'edit';
  initialCategory?: Category | null;
};

export function CategoryForm({
  mode,
  initialCategory = null,
}: CategoryFormProps) {
  const [name, setName] = useState(initialCategory?.name ?? '');
  const [description, setDescription] = useState(initialCategory?.description ?? '');
  const [savedCategory, setSavedCategory] = useState<Category | null>(initialCategory);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setErrorMessage('Вкажіть назву категорії.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: trimmedName,
        description: trimmedDescription || undefined,
      };

      const result =
        mode === 'create'
          ? await CategoriesService.createCategory(payload)
          : await CategoriesService.updateCategory(initialCategory!.id, payload);

      setSavedCategory(result);
      setName(result.name);
      setDescription(result.description ?? '');
      setSuccessMessage(
        mode === 'create'
          ? 'Категорію успішно створено.'
          : 'Зміни до категорії успішно збережено.',
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося зберегти категорію.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Categories</p>
          <h1>{mode === 'create' ? 'Створення категорії' : 'Редагування категорії'}</h1>
        </div>

        <div className="toolbar-actions">
          <Link href="/categories" className="outline-link">
            До списку категорій
          </Link>
          {savedCategory ? <span className="helper-text">ID: {savedCategory.id}</span> : null}
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
      {successMessage ? <div className="success-message">{successMessage}</div> : null}

      <form className="auth-form product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Назва категорії</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Електроніка"
            />
          </label>

          <label className="form-field form-field-wide">
            <span>Опис</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Короткий опис категорії"
              rows={4}
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Створюємо категорію...'
                : 'Зберігаємо зміни...'
              : mode === 'create'
                ? 'Створити категорію'
                : 'Зберегти зміни'}
          </button>
          <Link href="/categories" className="outline-link">
            Скасувати
          </Link>
        </div>
      </form>
    </section>
  );
}
