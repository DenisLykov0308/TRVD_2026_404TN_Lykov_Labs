'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { ApiClientError } from '@/services/api/client';
import { StockReceiptsService } from '@/services/api/stock-receipts.service';
import type { StockReceipt } from '@/types/inventory';

export default function StockReceiptsPage() {
  const [receipts, setReceipts] = useState<StockReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadReceipts() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await StockReceiptsService.getStockReceipts();
        if (isMounted) {
          setReceipts(response);
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
          setErrorMessage('Не вдалося завантажити список надходжень.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReceipts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Stock receipts</p>
          <h1>Надходження товару</h1>
          <p>Список документів оприбуткування з доступом до детальної інформації про кожну партію.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/stock-receipts/create" className="primary-button">
            Нове надходження
          </Link>
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо надходження..." />
      ) : receipts.length > 0 ? (
        <div className="table-wrapper">
          <table className="products-table directory-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Постачальник</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Сума</th>
                <th>Позиції</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td>{receipt.receipt_number}</td>
                  <td>{receipt.supplier.name}</td>
                  <td>{formatDateTime(receipt.receipt_date)}</td>
                  <td>{receipt.status}</td>
                  <td>{formatCurrency(receipt.total_amount)}</td>
                  <td>{receipt.items.length}</td>
                  <td>
                    <Link href={`/stock-receipts/${receipt.id}`} className="outline-link compact-link">
                      Деталі
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">Документи надходження ще не створені.</div>
      )}
    </section>
  );
}
