'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { formatDateTime } from '@/lib/formatters';
import { ApiClientError } from '@/services/api/client';
import { InventoryTransactionsService } from '@/services/api/inventory-transactions.service';
import type { InventoryTransaction } from '@/types/inventory';

export default function InventoryTransactionsPage() {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await InventoryTransactionsService.getInventoryTransactions();
        if (isMounted) {
          setTransactions(response);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiClientError) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Не вдалося завантажити історію руху товарів.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Inventory transactions</p>
          <h1>Історія руху товарів</h1>
          <p>Журнал руху відображає надходження й відвантаження по кожному товару без вигаданих додаткових операцій.</p>
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо історію руху товарів..." />
      ) : transactions.length > 0 ? (
        <div className="table-wrapper">
          <table className="products-table directory-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тип</th>
                <th>Товар</th>
                <th>Кількість</th>
                <th>Джерело</th>
                <th>Створив</th>
                <th>Коментар</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDateTime(transaction.transaction_date)}</td>
                  <td>{transaction.transaction_type === 'IN' ? 'Надходження' : 'Відвантаження'}</td>
                  <td>
                    <div className="table-primary">{transaction.product.name}</div>
                    <div className="table-secondary">{transaction.product.sku}</div>
                  </td>
                  <td>{transaction.quantity}</td>
                  <td>
                    {transaction.reference_type} #{transaction.reference_id}
                  </td>
                  <td>{transaction.created_by.full_name}</td>
                  <td>{transaction.comment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">Історія руху товарів поки порожня.</div>
      )}
    </section>
  );
}
