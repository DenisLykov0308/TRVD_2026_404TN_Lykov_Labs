'use client';

import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';

type AdminOnlyProps = PropsWithChildren<{
  title?: string;
  description?: string;
  backHref?: string;
}>;

export function AdminOnly({
  children,
  title = 'Доступ лише для адміністратора',
  description = 'Ваш обліковий запис не має прав для виконання цієї операції.',
  backHref = '/dashboard',
}: AdminOnlyProps) {
  const { isInitializing, user } = useAuth();

  if (isInitializing) {
    return (
      <section className="workspace-panel">
        <div className="auth-state-message">Перевіряємо права доступу...</div>
      </section>
    );
  }

  if (!isAdminRole(user?.role)) {
    return (
      <section className="workspace-panel">
        <div className="page-heading">
          <div>
            <p className="section-kicker">Admin only</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>

        <div className="error-message">
          Ця дія доступна лише користувачу з роллю адміністратора.
        </div>

        <div className="toolbar-actions">
          <Link href={backHref} className="outline-link">
            Повернутися назад
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
