'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import { isAdminRole } from '@/lib/roles';
import { CategoriesService } from '@/services/api/categories.service';
import { CustomersService } from '@/services/api/customers.service';
import { InventoryTransactionsService } from '@/services/api/inventory-transactions.service';
import { ProductService } from '@/services/api/products.service';
import { StockReceiptsService } from '@/services/api/stock-receipts.service';
import { StockShipmentsService } from '@/services/api/stock-shipments.service';
import { SuppliersService } from '@/services/api/suppliers.service';
import { UnitsService } from '@/services/api/units.service';

type ModuleSummary = {
  key: string;
  title: string;
  href: string;
  description: string;
  count: number | null;
  accent?: 'default' | 'warning' | 'success';
};

export function DashboardOverview() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      setIsLoading(true);
      setErrorMessage('');

      const results = await Promise.allSettled([
        ProductService.getProducts(),
        CategoriesService.getCategories(),
        SuppliersService.getSuppliers(),
        CustomersService.getCustomers(),
        UnitsService.getUnits(),
        StockReceiptsService.getStockReceipts(),
        StockShipmentsService.getStockShipments(),
        InventoryTransactionsService.getInventoryTransactions(),
      ]);

      if (!isMounted) {
        return;
      }

      setCounts({
        products: results[0].status === 'fulfilled' ? results[0].value.length : null,
        categories: results[1].status === 'fulfilled' ? results[1].value.length : null,
        suppliers: results[2].status === 'fulfilled' ? results[2].value.length : null,
        customers: results[3].status === 'fulfilled' ? results[3].value.length : null,
        units: results[4].status === 'fulfilled' ? results[4].value.length : null,
        receipts: results[5].status === 'fulfilled' ? results[5].value.length : null,
        shipments: results[6].status === 'fulfilled' ? results[6].value.length : null,
        transactions: results[7].status === 'fulfilled' ? results[7].value.length : null,
      });

      if (results.some((result) => result.status === 'rejected')) {
        setErrorMessage(
          'Частину зведених даних не вдалося завантажити. Навігація по системі залишається доступною.',
        );
      }

      setIsLoading(false);
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const isAdmin = isAdminRole(user?.role);

  const modules = useMemo<ModuleSummary[]>(
    () => [
      {
        key: 'products',
        title: 'Товари',
        href: '/products',
        description: 'Основний каталог складських позицій з залишками і картками товарів.',
        count: counts.products ?? null,
      },
      {
        key: 'categories',
        title: 'Категорії',
        href: '/categories',
        description: 'Довідник категорій для структуризації номенклатури.',
        count: counts.categories ?? null,
      },
      {
        key: 'suppliers',
        title: 'Постачальники',
        href: '/suppliers',
        description: 'Контрагенти для документів надходження товару.',
        count: counts.suppliers ?? null,
      },
      {
        key: 'customers',
        title: 'Клієнти',
        href: '/customers',
        description: 'База клієнтів для перегляду та оформлення відвантажень.',
        count: counts.customers ?? null,
      },
      {
        key: 'units',
        title: 'Одиниці виміру',
        href: '/units',
        description: 'Довідник одиниць виміру для товарів і складських документів.',
        count: counts.units ?? null,
      },
      {
        key: 'receipts',
        title: 'Надходження',
        href: '/stock-receipts',
        description: 'Робота з документами оприбуткування товару на склад.',
        count: counts.receipts ?? null,
        accent: 'success',
      },
      {
        key: 'shipments',
        title: 'Відвантаження',
        href: '/stock-shipments',
        description: 'Документи відпуску товарів клієнтам.',
        count: counts.shipments ?? null,
        accent: 'warning',
      },
      {
        key: 'transactions',
        title: 'Рух товарів',
        href: '/inventory-transactions',
        description: 'Історія всіх складських рухів по товарах.',
        count: counts.transactions ?? null,
      },
    ],
    [counts],
  );

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Dashboard</p>
          <h1>Панель керування складською системою</h1>
        
        </div>

        <div className="toolbar-actions">
          <Link href="/products" className="primary-button">
            До товарів
          </Link>
          <Link href="/stock-receipts/create" className="outline-link">
            Нове надходження
          </Link>
          <Link href="/stock-shipments/create" className="outline-link">
            Нове відвантаження
          </Link>
        </div>
      </div>

      <div className="dashboard-welcome">
        <div className="user-badge user-badge-wide">
          <span>Поточний користувач</span>
          <strong>{user?.full_name || user?.email}</strong>
          <p>
            {isAdmin
              ? 'Адміністративні операції доступні в тих модулях, де їх підтримує API.'
              : 'Доступні перегляд, документи руху товарів і дозволені користувацькі операції.'}
          </p>
        </div>
        <div className="dashboard-note">
          <strong>Робочий сценарій</strong>
          <p>
            Після авторизації ви одразу потрапляєте в систему обліку складу. 
          </p>
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо зведення по складських модулях..." />
      ) : (
        <div className="dashboard-grid">
          {modules.map((moduleItem) => (
            <Link
              key={moduleItem.key}
              href={moduleItem.href}
              className={`dashboard-card dashboard-card-${moduleItem.accent ?? 'default'}`}
            >
              <div className="dashboard-card-top">
                <p className="section-kicker">{moduleItem.title}</p>
                <strong>{moduleItem.count ?? '—'}</strong>
              </div>
              <h2>{moduleItem.title}</h2>
              <p>{moduleItem.description}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
