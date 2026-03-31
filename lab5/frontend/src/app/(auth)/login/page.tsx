import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <Suspense fallback={<section className="auth-page"><div className="auth-card">Завантажуємо форму входу...</div></section>}>
      <LoginForm />
    </Suspense>
  );
}
