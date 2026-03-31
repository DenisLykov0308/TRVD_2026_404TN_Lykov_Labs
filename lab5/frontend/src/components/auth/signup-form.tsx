'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ApiClientError } from '@/services/api/client';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const { isAuthenticated, isInitializing, signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isInitializing, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
      setErrorMessage('Усі поля форми є обов’язковими.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorMessage('Введіть коректну email-адресу.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Пароль має містити щонайменше 8 символів.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Підтвердження пароля не збігається.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        full_name: trimmedFullName,
        email: trimmedEmail,
        password,
      });

      router.push('/login?registered=1');
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося виконати реєстрацію. Спробуйте ще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <p className="section-kicker">Auth</p>
          <h1>Реєстрація користувача</h1>
        </div>

        {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Повне ім’я</span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Іван Коваленко"
              autoComplete="name"
            />
          </label>

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
              placeholder="Щонайменше 8 символів"
              autoComplete="new-password"
            />
          </label>

          <label className="form-field">
            <span>Підтвердження пароля</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Повторіть пароль"
              autoComplete="new-password"
            />
          </label>

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Створюємо обліковий запис...' : 'Зареєструватися'}
            </button>
            <Link href="/login" className="outline-link">
              Уже є акаунт
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
