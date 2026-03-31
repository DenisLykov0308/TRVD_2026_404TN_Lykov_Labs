'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';

export function AppHeader() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = isAdminRole(user?.role);

  const navigationItems = [
    { href: '/dashboard', label: 'Кабінет' },
    { href: '/products', label: 'Товари' },
    { href: '/categories', label: 'Категорії' },
    { href: '/suppliers', label: 'Постачальники' },
    { href: '/customers', label: 'Клієнти' },
    { href: '/units', label: 'Одиниці' },
    { href: '/stock-receipts', label: 'Надходження' },
    { href: '/stock-shipments', label: 'Відвантаження' },
    { href: '/inventory-transactions', label: 'Рух товарів' },
  ];

  function isActiveLink(href: string): boolean {
    if (!pathname) {
      return false;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    signOut();
    router.push('/login');
  }

  return (
    <header className="app-header">
      <div className="brand-block">
        <p className="section-kicker">Warehouse UI</p>
        <Link href="/dashboard" className="brand-title">
          Веб-система обліку складу
        </Link>
        <nav className="header-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActiveLink(item.href) ? 'active-link' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="header-actions">
        <div className="user-badge">
          <span>{isAdmin ? 'Адміністратор' : 'Користувач'}</span>
          <strong>
            {user?.full_name || user?.email || 'Авторизований користувач'}
          </strong>
        </div>
        <button type="button" className="outline-button" onClick={handleLogout}>
          Вихід
        </button>
      </div>
    </header>
  );
}
