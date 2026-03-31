'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { ApiClientError } from '@/services/api/client';
import { StockShipmentsService } from '@/services/api/stock-shipments.service';
import type { StockShipment } from '@/types/inventory';

export default function StockShipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<StockShipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadShipment() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id < 1) {
        setErrorMessage('Некоректний ідентифікатор документа відвантаження.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await StockShipmentsService.getStockShipmentById(id);
        if (isMounted) {
          setShipment(response);
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
          setErrorMessage('Не вдалося завантажити документ відвантаження.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadShipment();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Stock shipments</p>
          <h1>Документ відвантаження</h1>
          <p>Картка документа відвантаження відображає клієнта, автора документа та перелік відпущених товарів.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/stock-shipments" className="outline-link">
            До списку відвантажень
          </Link>
          <Link href="/stock-shipments/create" className="outline-link">
            Створити новий документ
          </Link>
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо документ відвантаження..." />
      ) : shipment ? (
        <div className="document-details-stack">
          <div className="details-grid">
            <article className="details-card">
              <h2>Основні реквізити</h2>
              <dl className="details-list">
                <div className="details-item">
                  <dt>Номер</dt>
                  <dd>{shipment.shipment_number}</dd>
                </div>
                <div className="details-item">
                  <dt>Дата</dt>
                  <dd>{formatDateTime(shipment.shipment_date)}</dd>
                </div>
                <div className="details-item">
                  <dt>Статус</dt>
                  <dd>{shipment.status}</dd>
                </div>
                <div className="details-item">
                  <dt>Сума</dt>
                  <dd>{formatCurrency(shipment.total_amount)}</dd>
                </div>
              </dl>
            </article>
            <article className="details-card">
              <h2>Контекст документа</h2>
              <dl className="details-list">
                <div className="details-item">
                  <dt>Клієнт</dt>
                  <dd>{shipment.customer.name}</dd>
                </div>
                <div className="details-item">
                  <dt>Створив</dt>
                  <dd>{shipment.created_by.full_name}</dd>
                </div>
                <div className="details-item">
                  <dt>Email відповідального</dt>
                  <dd>{shipment.created_by.email}</dd>
                </div>
                <div className="details-item">
                  <dt>Коментар</dt>
                  <dd>{shipment.comment || '—'}</dd>
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
                {shipment.items.map((item) => (
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
        <div className="empty-state">Документ відвантаження не знайдено.</div>
      )}
    </section>
  );
}
