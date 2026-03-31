'use client';

import { useState } from 'react';
import { ApiClientError } from '@/services/api/client';
import { ProductService } from '@/services/api/products.service';
import type { Product } from '@/types/product';

type DeleteProductButtonProps = {
  productId: number;
  productName: string;
  onDeleted: (deletedProduct: Product) => void | Promise<void>;
};

export function DeleteProductButton({
  productId,
  productName,
  onDeleted,
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleDelete() {
    const isConfirmed = window.confirm(
      `Ви дійсно хочете видалити товар "${productName}"?`,
    );

    if (!isConfirmed) {
      return;
    }

    setErrorMessage('');
    setIsDeleting(true);

    try {
      const deletedProduct = await ProductService.deleteProduct(productId);
      await onDeleted(deletedProduct);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Не вдалося видалити товар. Спробуйте ще раз.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="inline-action-stack">
      <button
        type="button"
        className="danger-button"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Видаляємо...' : 'Видалити'}
      </button>
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
    </div>
  );
}
