'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { ApiClientError } from '@/services/api/client';
import { StockShipmentsService } from '@/services/api/stock-shipments.service';
import type { StockShipment } from '@/types/inventory';

export default function StockShipmentsPage() {
  const [shipments, setShipments] = useState<StockShipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadShipments() {
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await StockShipmentsService.getStockShipments();
        if (isMounted) {
          setShipments(response);
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
          setErrorMessage('Не вдалося завантажити список відвантажень.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadShipments();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Stock shipments</p>
          <h1>Відвантаження товару</h1>
          <p>Список документів відвантаження з можливістю перегляду кожного документа окремо.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/stock-shipments/create" className="primary-button">
            Нове відвантаження
          </Link>
        </div>
      </div>

      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо відвантаження..." />
      ) : shipments.length > 0 ? (
        <div className="table-wrapper">
          <table className="products-table directory-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Клієнт</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Сума</th>
                <th>Позиції</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>{shipment.shipment_number}</td>
                  <td>{shipment.customer.name}</td>
                  <td>{formatDateTime(shipment.shipment_date)}</td>
                  <td>{shipment.status}</td>
                  <td>{formatCurrency(shipment.total_amount)}</td>
                  <td>{shipment.items.length}</td>
                  <td>
                    <Link href={`/stock-shipments/${shipment.id}`} className="outline-link compact-link">
                      Деталі
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">Документи відвантаження ще не створені.</div>
      )}
    </section>
  );
}
