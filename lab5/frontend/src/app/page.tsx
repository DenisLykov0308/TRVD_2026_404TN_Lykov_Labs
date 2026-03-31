'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    router.replace(isAuthenticated ? '/dashboard' : '/login');
  }, [isAuthenticated, isInitializing, router]);

  return (
    <section className="auth-page auth-page-centered">
      <div className="auth-state-message auth-state-message-wide">
        {isInitializing
          ? 'Перевіряємо активну сесію та відкриваємо робочий сценарій системи...'
          : 'Переходимо до потрібного розділу системи...'}
      </div>
    </section>
  );
}
