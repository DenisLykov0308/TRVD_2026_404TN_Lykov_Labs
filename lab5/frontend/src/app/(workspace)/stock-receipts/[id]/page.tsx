'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { ApiClientError } from '@/services/api/client';
import { StockReceiptsService } from '@/services/api/stock-receipts.service';
import type { StockReceipt } from '@/types/inventory';

export default function StockReceiptDetailsPage() {
  const params = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<StockReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadReceipt() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id < 1) {
        setErrorMessage('Некоректний ідентифікатор документа надходження.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await StockReceiptsService.getStockReceiptById(id);
        if (isMounted) {
          setReceipt(response);
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
          setErrorMessage('Не вдалося завантажити документ надходження.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReceipt();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Stock receipts</p>
          <h1>Документ надходження</h1>
          <p>Картка документа відображає постачальника, відповідального користувача та склад партії товару.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/stock-receipts" className="outline-link">
            До списку надходжень
          </Link>
          <Link href="/stock-receipts/create" className="outline-link">
            Створити новий документ
          </Link>
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо документ надходження..." />
      ) : receipt ? (
        <div className="document-details-stack">
          <div className="details-grid">
            <article className="details-card">
              <h2>Основні реквізити</h2>
              <dl className="details-list">
                <div className="details-item">
                  <dt>Номер</dt>
                  <dd>{receipt.receipt_number}</dd>
                </div>
                <div className="details-item">
                  <dt>Дата</dt>
                  <dd>{formatDateTime(receipt.receipt_date)}</dd>
                </div>
                <div className="details-item">
                  <dt>Статус</dt>
                  <dd>{receipt.status}</dd>
                </div>
                <div className="details-item">
                  <dt>Сума</dt>
                  <dd>{formatCurrency(receipt.total_amount)}</dd>
                </div>
              </dl>
            </article>
            <article className="details-card">
              <h2>Контекст документа</h2>
              <dl className="details-list">
                <div className="details-item">
                  <dt>Постачальник</dt>
                  <dd>{receipt.supplier.name}</dd>
                </div>
                <div className="details-item">
                  <dt>Створив</dt>
                  <dd>{receipt.created_by.full_name}</dd>
                </div>
                <div className="details-item">
                  <dt>Email відповідального</dt>
                  <dd>{receipt.created_by.email}</dd>
                </div>
                <div className="details-item">
                  <dt>Коментар</dt>
                  <dd>{receipt.comment || '—'}</dd>
                </div>
              </dl>
            </article>
          </div>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>SKU</th>
                  <th>Кількість</th>
                  <th>Ціна</th>
                  <th>Сума</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.product.sku}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unit_price)}</td>
                    <td>{formatCurrency(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">Документ надходження не знайдено.</div>
      )}
    </section>
  );
}
