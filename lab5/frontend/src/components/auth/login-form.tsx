'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ApiClientError } from '@/services/api/client';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const { isAuthenticated, isInitializing, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace(resolveNextPath(searchParams.get('next')));
    }
  }, [isAuthenticated, isInitializing, router, searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage('Заповніть email і пароль.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorMessage('Введіть коректну email-адресу.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({
        email: trimmedEmail,
        password,
      });

      router.push(resolveNextPath(searchParams.get('next')));
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося виконати вхід. Спробуйте ще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRegistered = searchParams.get('registered') === '1';

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <p className="section-kicker">Auth</p>
          <h1>Вхід до системи</h1>
        </div>

        {isRegistered ? (
          <div className="success-message">
            Реєстрація виконана успішно. Тепер можна увійти до системи.
          </div>
        ) : null}

        {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@warehouse.local"
              autoComplete="email"
            />
          </label>

          <label className="form-field">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введіть пароль"
              autoComplete="current-password"
            />
          </label>

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Виконуємо вхід...' : 'Увійти'}
            </button>
            <Link href="/signup" className="outline-link">
              Створити обліковий запис
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

function resolveNextPath(nextPath: string | null): string {
  if (nextPath && nextPath.startsWith('/')) {
    return nextPath;
  }

  return '/dashboard';
}
