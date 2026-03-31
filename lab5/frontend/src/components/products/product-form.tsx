'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import type { Category, Supplier, Unit } from '@/types/reference';
import type { Product, ProductPayload } from '@/types/product';
import { ApiClientError } from '@/services/api/client';
import { CategoriesService } from '@/services/api/categories.service';
import { ProductService } from '@/services/api/products.service';
import { SuppliersService } from '@/services/api/suppliers.service';
import { UnitsService } from '@/services/api/units.service';

type ProductFormMode = 'create' | 'edit';

type ProductFormProps = {
  mode: ProductFormMode;
  initialProduct?: Product | null;
};

type ProductFormState = {
  name: string;
  sku: string;
  description: string;
  category_id: string;
  supplier_id: string;
  unit_id: string;
  price: string;
  quantity: string;
  min_quantity: string;
};

const EMPTY_FORM_STATE: ProductFormState = {
  name: '',
  sku: '',
  description: '',
  category_id: '',
  supplier_id: '',
  unit_id: '',
  price: '',
  quantity: '',
  min_quantity: '',
};

function toFormState(product?: Product | null): ProductFormState {
  if (!product) {
    return EMPTY_FORM_STATE;
  }

  return {
    name: product.name,
    sku: product.sku,
    description: product.description || '',
    category_id: String(product.category.id),
    supplier_id: String(product.supplier.id),
    unit_id: String(product.unit.id),
    price: String(product.price),
    quantity: String(product.quantity),
    min_quantity: String(product.min_quantity),
  };
}

export function ProductForm({
  mode,
  initialProduct = null,
}: ProductFormProps) {
  const [formState, setFormState] = useState<ProductFormState>(
    toFormState(initialProduct),
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [savedProduct, setSavedProduct] = useState<Product | null>(initialProduct);
  const [isLoadingReferences, setIsLoadingReferences] = useState(true);
  const [referencesError, setReferencesError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(toFormState(initialProduct));
    setSavedProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    let isMounted = true;

    async function loadReferences() {
      setReferencesError('');
      setIsLoadingReferences(true);

      try {
        const [categoriesResponse, suppliersResponse, unitsResponse] =
          await Promise.all([
            CategoriesService.getCategories(),
            SuppliersService.getSuppliers(),
            UnitsService.getUnits(),
          ]);

        if (!isMounted) {
          return;
        }

        setCategories(categoriesResponse);
        setSuppliers(suppliersResponse);
        setUnits(unitsResponse);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiClientError) {
          setReferencesError(error.message);
        } else if (error instanceof Error) {
          setReferencesError(error.message);
        } else {
          setReferencesError(
            'Не вдалося завантажити довідники для форми товару.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingReferences(false);
        }
      }
    }

    loadReferences();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleFieldChange(
    field: keyof ProductFormState,
    value: string,
  ) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = buildPayload(formState);

      setIsSubmitting(true);
      const result =
        mode === 'create'
          ? await ProductService.createProduct(payload)
          : await ProductService.updateProduct(initialProduct!.id, payload);

      setSavedProduct(result);
      setFormState(toFormState(result));
      setSuccessMessage(
        mode === 'create'
          ? 'Товар успішно створено.'
          : 'Зміни до товару успішно збережено.',
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          mode === 'create'
            ? 'Не вдалося створити товар. Спробуйте ще раз.'
            : 'Не вдалося оновити товар. Спробуйте ще раз.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-panel">
      <div className="page-heading">
        <div>
          <p className="section-kicker">Products</p>
          <h1>
            {mode === 'create' ? 'Створення товару' : 'Редагування товару'}
          </h1>
        </div>

        <div className="toolbar-actions">
          <Link href="/products" className="outline-link">
            До списку товарів
          </Link>
          {savedProduct ? (
            <Link href={`/products/${savedProduct.id}`} className="outline-link">
              До деталей товару
            </Link>
          ) : null}
        </div>
      </div>

      {referencesError ? <div className="error-message">{referencesError}</div> : null}
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
      {successMessage ? <div className="success-message">{successMessage}</div> : null}

      {isLoadingReferences ? (
        <LoadingSpinner label="Завантажуємо довідники для форми товару..." />
      ) : (
        <form className="auth-form product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Назва товару</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
                placeholder="Ноутбук офісний"
              />
            </label>

            <label className="form-field">
              <span>SKU</span>
              <input
                type="text"
                value={formState.sku}
                onChange={(event) => handleFieldChange('sku', event.target.value)}
                placeholder="NB-001"
              />
            </label>

            <label className="form-field form-field-wide">
              <span>Опис</span>
              <textarea
                value={formState.description}
                onChange={(event) =>
                  handleFieldChange('description', event.target.value)
                }
                placeholder="Короткий опис товару"
                rows={4}
              />
            </label>

            <label className="form-field">
              <span>Категорія</span>
              <select
                value={formState.category_id}
                onChange={(event) =>
                  handleFieldChange('category_id', event.target.value)
                }
              >
                <option value="">Оберіть категорію</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Постачальник</span>
              <select
                value={formState.supplier_id}
                onChange={(event) =>
                  handleFieldChange('supplier_id', event.target.value)
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
              <span>Одиниця виміру</span>
              <select
                value={formState.unit_id}
                onChange={(event) =>
                  handleFieldChange('unit_id', event.target.value)
                }
              >
                <option value="">Оберіть одиницю виміру</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.short_name})
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Ціна</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formState.price}
                onChange={(event) => handleFieldChange('price', event.target.value)}
                placeholder="0.00"
              />
            </label>

            <label className="form-field">
              <span>Кількість</span>
              <input
                type="number"
                min="0"
                step="1"
                value={formState.quantity}
                onChange={(event) =>
                  handleFieldChange('quantity', event.target.value)
                }
                placeholder="0"
              />
            </label>

            <label className="form-field">
              <span>Мінімальна кількість</span>
              <input
                type="number"
                min="0"
                step="1"
                value={formState.min_quantity}
                onChange={(event) =>
                  handleFieldChange('min_quantity', event.target.value)
                }
                placeholder="0"
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === 'create'
                  ? 'Створюємо товар...'
                  : 'Зберігаємо зміни...'
                : mode === 'create'
                  ? 'Створити товар'
                  : 'Зберегти зміни'}
            </button>
            <Link href="/products" className="outline-link">
              Скасувати
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

function buildPayload(formState: ProductFormState): ProductPayload {
  const name = formState.name.trim();
  const sku = formState.sku.trim();
  const description = formState.description.trim();
  const categoryId = Number.parseInt(formState.category_id, 10);
  const supplierId = Number.parseInt(formState.supplier_id, 10);
  const unitId = Number.parseInt(formState.unit_id, 10);
  const price = Number.parseFloat(formState.price);
  const quantity =
    formState.quantity.trim() === ''
      ? undefined
      : Number.parseInt(formState.quantity, 10);
  const minQuantity =
    formState.min_quantity.trim() === ''
      ? undefined
      : Number.parseInt(formState.min_quantity, 10);

  if (!name || !sku) {
    throw new Error('Заповніть назву товару та SKU.');
  }

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    throw new Error('Оберіть категорію товару.');
  }

  if (!Number.isInteger(supplierId) || supplierId < 1) {
    throw new Error('Оберіть постачальника товару.');
  }

  if (!Number.isInteger(unitId) || unitId < 1) {
    throw new Error('Оберіть одиницю виміру.');
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Вкажіть коректну ціну товару.');
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    throw new Error('Кількість має бути цілим невід’ємним числом.');
  }

  if (
    minQuantity !== undefined &&
    (!Number.isInteger(minQuantity) || minQuantity < 0)
  ) {
    throw new Error(
      'Мінімальна кількість має бути цілим невід’ємним числом.',
    );
  }

  return {
    name,
    sku,
    description: description || undefined,
    category_id: categoryId,
    supplier_id: supplierId,
    unit_id: unitId,
    price,
    quantity,
    min_quantity: minQuantity,
  };
}
