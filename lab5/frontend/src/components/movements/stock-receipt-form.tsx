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
import { ProductService } from '@/services/api/products.service';
import { StockReceiptsService } from '@/services/api/stock-receipts.service';
import { SuppliersService } from '@/services/api/suppliers.service';
import type { StockReceipt, StockReceiptPayload } from '@/types/inventory';
import type { Product } from '@/types/product';
import type { Supplier } from '@/types/reference';

type FormState = {
  receipt_number: string;
  supplier_id: string;
  receipt_date: string;
  status: string;
  comment: string;
  items: StockDocumentFormItem[];
};

function createDefaultReceiptDate(): string {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function StockReceiptForm() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [savedReceipt, setSavedReceipt] = useState<StockReceipt | null>(null);
  const [formState, setFormState] = useState<FormState>({
    receipt_number: '',
    supplier_id: '',
    receipt_date: createDefaultReceiptDate(),
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
        const [productsResponse, suppliersResponse] = await Promise.all([
          ProductService.getProducts(),
          SuppliersService.getSuppliers(),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(productsResponse);
        setSuppliers(suppliersResponse);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiClientError) {
          setReferencesError(error.message);
        } else if (error instanceof Error) {
          setReferencesError(error.message);
        } else {
          setReferencesError('Не вдалося завантажити довідники для документа надходження.');
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
      const payload = buildReceiptPayload(formState, user.id);
      setIsSubmitting(true);

      const result = await StockReceiptsService.createStockReceipt(payload);
      setSavedReceipt(result);
      setSuccessMessage('Документ надходження успішно створено.');
      setFormState({
        receipt_number: '',
        supplier_id: '',
        receipt_date: createDefaultReceiptDate(),
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
        setErrorMessage('Не вдалося створити документ надходження.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Stock receipts</p>
          <h1>Нове надходження</h1>
          <p>Форма працює з реальними товарами та постачальниками і створює документ оприбуткування.</p>
        </div>

        <div className="toolbar-actions">
          <Link href="/stock-receipts" className="outline-link">
            До списку надходжень
          </Link>
          {savedReceipt ? (
            <Link href={`/stock-receipts/${savedReceipt.id}`} className="outline-link">
              Переглянути створений документ
            </Link>
          ) : null}
        </div>
      </div>

      {referencesError ? <div className="error-message">{referencesError}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
      {successMessage ? <div className="success-message">{successMessage}</div> : null}

      {isLoading ? (
        <LoadingSpinner label="Завантажуємо товари та постачальників..." />
      ) : (
        <form className="auth-form product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Номер документа</span>
              <input
                type="text"
                value={formState.receipt_number}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    receipt_number: event.target.value,
                  }))
                }
                placeholder="REC-001"
              />
            </label>

            <label className="form-field">
              <span>Постачальник</span>
              <select
                value={formState.supplier_id}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    supplier_id: event.target.value,
                  }))
                }
              >
                <option value="">Оберіть постачальника</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Дата надходження</span>
              <input
                type="datetime-local"
                value={formState.receipt_date}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    receipt_date: event.target.value,
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
                placeholder="Партія товару від постачальника"
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
              {isSubmitting ? 'Створюємо документ...' : 'Створити надходження'}
            </button>
            <Link href="/stock-receipts" className="outline-link">
              Скасувати
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

function buildReceiptPayload(
  formState: FormState,
  createdBy: number,
): StockReceiptPayload {
  const receiptNumber = formState.receipt_number.trim();
  const supplierId = Number.parseInt(formState.supplier_id, 10);

  if (!receiptNumber) {
    throw new Error('Вкажіть номер документа надходження.');
  }

  if (!Number.isInteger(supplierId) || supplierId < 1) {
    throw new Error('Оберіть постачальника для документа надходження.');
  }

  if (!formState.receipt_date) {
    throw new Error('Вкажіть дату та час надходження.');
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
    receipt_number: receiptNumber,
    supplier_id: supplierId,
    created_by: createdBy,
    receipt_date: new Date(formState.receipt_date).toISOString(),
    status: formState.status.trim() || undefined,
    comment: formState.comment.trim() || undefined,
    items,
  };
}
