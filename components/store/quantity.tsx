'use client';
export function Quantity({
  value,
  onChange,
  label = 'Quantity',
  compact = false,
  min = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  compact?: boolean;
  min?: number;
}) {
  return (
    <div className={`quantity ${compact ? 'small' : ''}`} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}
