'use client';

import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitializing || isAuthenticated) {
      return;
    }

    const nextParam =
      pathname && pathname !== '/'
        ? `?next=${encodeURIComponent(pathname)}`
        : '';

    router.replace(`/login${nextParam}`);
  }, [isAuthenticated, isInitializing, pathname, router]);

  if (isInitializing) {
    return <div className="auth-state-message">Перевіряємо поточну сесію...</div>;
  }

  if (!isAuthenticated) {
    return <div className="auth-state-message">Перенаправляємо на сторінку входу...</div>;
  }

  return <>{children}</>;
}
