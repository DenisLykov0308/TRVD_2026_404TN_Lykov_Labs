type LoadingSpinnerProps = {
  label?: string;
};

export function LoadingSpinner({
  label = 'Завантаження даних...',
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="spinner-dot" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
