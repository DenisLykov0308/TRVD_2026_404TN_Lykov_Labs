'use client';

import { useState } from 'react';
import { ApiClientError } from '@/services/api/client';

type DeleteActionButtonProps<T> = {
  entityLabel: string;
  confirmMessage: string;
  onDelete: () => Promise<T>;
  onDeleted: (result: T) => void | Promise<void>;
};

export function DeleteActionButton<T>({
  entityLabel,
  confirmMessage,
  onDelete,
  onDeleted,
}: DeleteActionButtonProps<T>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleDelete() {
    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) {
      return;
    }

    setErrorMessage('');
    setIsDeleting(true);

    try {
      const deletedRecord = await onDelete();
      await onDeleted(deletedRecord);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(`Не вдалося видалити ${entityLabel}.`);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="inline-action-stack">
      <button
        type="button"
        className="danger-button compact-link"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Видаляємо...' : 'Видалити'}
      </button>
      {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
    </div>
  );
}
