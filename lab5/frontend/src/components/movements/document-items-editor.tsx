'use client';

import { formatCurrency } from '@/lib/formatters';
import type { Product } from '@/types/product';

export type StockDocumentFormItem = {
  product_id: string;
  quantity: string;
  unit_price: string;
};

type DocumentItemsEditorProps = {
  items: StockDocumentFormItem[];
  products: Product[];
  onChange: (items: StockDocumentFormItem[]) => void;
};

const EMPTY_ITEM: StockDocumentFormItem = {
  product_id: '',
  quantity: '1',
  unit_price: '0',
};

export function createEmptyDocumentItem(): StockDocumentFormItem {
  return { ...EMPTY_ITEM };
}

export function DocumentItemsEditor({
  items,
  products,
  onChange,
}: DocumentItemsEditorProps) {
  function handleItemChange(
    index: number,
    field: keyof StockDocumentFormItem,
    value: string,
  ) {
    onChange(
      items.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function handleAddItem() {
    onChange([...items, createEmptyDocumentItem()]);
  }

  function handleRemoveItem(index: number) {
    if (items.length === 1) {
      onChange([createEmptyDocumentItem()]);
      return;
    }

    onChange(items.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="document-items-panel">
      <div className="document-items-header">
        <div>
          <p className="section-kicker">Позиції документа</p>
          <h2>Склад документа</h2>
        </div>
        <button type="button" className="outline-button" onClick={handleAddItem}>
          Додати позицію
        </button>
      </div>

      <div className="table-wrapper">
        <table className="products-table document-items-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Кількість</th>
              <th>Ціна за одиницю</th>
              <th>Сума</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const quantity = Number(item.quantity);
              const unitPrice = Number(item.unit_price);
              const lineTotal =
                Number.isFinite(quantity) && Number.isFinite(unitPrice)
                  ? quantity * unitPrice
                  : 0;

              return (
                <tr key={`${index}-${item.product_id || 'new'}`}>
                  <td>
                    <select
                      value={item.product_id}
                      onChange={(event) =>
                        handleItemChange(index, 'product_id', event.target.value)
                      }
                    >
                      <option value="">Оберіть товар</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(index, 'quantity', event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(event) =>
                        handleItemChange(index, 'unit_price', event.target.value)
                      }
                    />
                  </td>
                  <td>{formatCurrency(lineTotal || 0)}</td>
                  <td>
                    <button
                      type="button"
                      className="outline-button compact-link"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Видалити рядок
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
