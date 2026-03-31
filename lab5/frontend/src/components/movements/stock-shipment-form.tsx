'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import {
  createEmptyDocumentItem,
  DocumentItemsEditor,
  type StockDocumentFormItem,
} from '@/components/movements/document-items-editor';
import { useAuth } from '@/context/auth-context';
import { ApiClientError } from '@/services/api/client';
import { CustomersService } from '@/services/api/customers.service';
import { ProductService } from '@/services/api/products.service';
import { StockShipmentsService } from '@/services/api/stock-shipments.service';
import type { StockShipment, StockShipmentPayload } from '@/types/inventory';
import type { Product } from '@/types/product';
import type { Customer } from '@/types/reference';

type FormState = {
  shipment_number: string;
  customer_id: string;
  shipment_date: string;
  status: string;
  comment: string;
  items: StockDocumentFormItem[];
};

function createDefaultShipmentDate(): string {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function StockShipmentForm() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [savedShipment, setSavedShipment] = useState<StockShipment | null>(null);
  const [formState, setFormState] = useState<FormState>({
    shipment_number: '',
    customer_id: '',
    shipment_date: createDefaultShipmentDate(),
    status: 'COMPLETED',
    comment: '',
    items: [createEmptyDocumentItem()],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [referencesError, setReferencesError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadReferences() {
      setIsLoading(true);
      setReferencesError('');

      try {
        const [productsResponse, customersResponse] = await Promise.all([
          ProductService.getProducts(),
          CustomersService.getCustomers(),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(productsResponse);
        setCustomers(customersResponse);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiClientError) {
          setReferencesError(error.message);
        } else if (error instanceof Error) {
          setReferencesError(error.message);
        } else {
          setReferencesError('Не вдалося завантажити довідники для документа відвантаження.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReferences();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!user) {
      setErrorMessage('Потрібна активна сесія користувача для створення документа.');
      return;
    }

    try {
      const payload = buildShipmentPayload(formState, user.id);
      setIsSubmitting(true);

      const result = await StockShipmentsService.createStockShipment(payload);
      setSavedShipment(result);
      setSuccessMessage('Документ відвантаження успішно створено.');
      setFormState({
        shipment_number: '',
        customer_id: '',
        shipment_date: createDefaultShipmentDate(),
        status: 'COMPLETED',
        comment: '',
        items: [createEmptyDocumentItem()],
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося створити документ відвантаження.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Stock shipments</p>
          <h1>Нове відвантаження</h1>
          <p>Форма створення документа відвантаження працює через реальні клієнтські та товарні довідники.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/stock-shipments" className="outline-link">
            До списку відвантажень
          </Link>
          {savedShipment ? (
            <Link href={`/stock-shipments/${savedShipment.id}`} className="outline-link">
              Переглянути створений документ
            </Link>
          ) : null}
        </div>
      </div>

      {referencesError ? <div className="error-message">{referencesError}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
      {successMessage ? <div className="success-message">{successMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо товари та клієнтів..." />
      ) : (
        <form className="auth-form product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Номер документа</span>
              <input
                type="text"
                value={formState.shipment_number}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    shipment_number: event.target.value,
                  }))
                }
                placeholder="SHP-001"
              />
            </label>

            <label className="form-field">
              <span>Клієнт</span>
              <select
                value={formState.customer_id}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    customer_id: event.target.value,
                  }))
                }
              >
                <option value="">Оберіть клієнта</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Дата відвантаження</span>
              <input
                type="datetime-local"
                value={formState.shipment_date}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    shipment_date: event.target.value,
                  }))
                }
              />
            </label>

            <label className="form-field">
              <span>Статус</span>
              <input
                type="text"
                value={formState.status}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    status: event.target.value,
                  }))
                }
                placeholder="COMPLETED"
              />
            </label>

            <label className="form-field form-field-wide">
              <span>Коментар</span>
              <textarea
                value={formState.comment}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    comment: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Відвантаження клієнту"
              />
            </label>
          </div>

          <DocumentItemsEditor
            items={formState.items}
            products={products}
            onChange={(items) =>
              setFormState((currentState) => ({
                ...currentState,
                items,
              }))
            }
          />

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Створюємо документ...' : 'Створити відвантаження'}
            </button>
            <Link href="/stock-shipments" className="outline-link">
              Скасувати
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

function buildShipmentPayload(
  formState: FormState,
  createdBy: number,
): StockShipmentPayload {
  const shipmentNumber = formState.shipment_number.trim();
  const customerId = Number.parseInt(formState.customer_id, 10);

  if (!shipmentNumber) {
    throw new Error('Вкажіть номер документа відвантаження.');
  }

  if (!Number.isInteger(customerId) || customerId < 1) {
    throw new Error('Оберіть клієнта для документа відвантаження.');
  }

  if (!formState.shipment_date) {
    throw new Error('Вкажіть дату та час відвантаження.');
  }

  const items = formState.items.map((item, index) => {
    const productId = Number.parseInt(item.product_id, 10);
    const quantity = Number.parseInt(item.quantity, 10);
    const unitPrice = Number.parseFloat(item.unit_price);

    if (!Number.isInteger(productId) || productId < 1) {
      throw new Error(`Оберіть товар у рядку ${index + 1}.`);
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Кількість у рядку ${index + 1} має бути додатним цілим числом.`);
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(`Вкажіть коректну ціну у рядку ${index + 1}.`);
    }

    return {
      product_id: productId,
      quantity,
      unit_price: unitPrice,
    };
  });

  return {
    shipment_number: shipmentNumber,
    customer_id: customerId,
    created_by: createdBy,
    shipment_date: new Date(formState.shipment_date).toISOString(),
    status: formState.status.trim() || undefined,
    comment: formState.comment.trim() || undefined,
    items,
  };
}
