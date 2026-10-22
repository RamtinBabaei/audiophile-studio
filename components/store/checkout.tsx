'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { Check, ChevronDown, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { checkoutSchema, quoteCart, type Receipt, type Quote } from '@/lib/shop/checkout';
import { money, shortName } from '@/lib/shop/catalog';
import { cartStore } from '@/lib/shop/cart-store';
import { useShop } from './shop-provider';
import { Modal } from './modal';
import { createUuid } from '@/lib/shop/uuid';

function Totals({ quote }: { quote: Quote }) {
  return (
    <div className="summary-totals">
      <div>
        <span>Total</span>
        <strong>{money(quote.subtotal)}</strong>
      </div>
      <div>
        <span>Shipping</span>
        <strong>{money(quote.shipping)}</strong>
      </div>
      <div>
        <span>VAT (included)</span>
        <strong>{money(quote.vat)}</strong>
      </div>
      <div className="grand-total">
        <span>Grand total</span>
        <strong>{money(quote.grandTotal)}</strong>
      </div>
    </div>
  );
}
function SummaryLines({ quote }: { quote: Quote }) {
  return (
    <ul className="summary-lines">
      {quote.items.map((item) => (
        <li key={item.productId}>
          <img src={`/assets/cart/image-${item.slug}.webp`} width={64} height={64} alt="" />
          <div>
            <strong>{shortName(item.name)}</strong>
            <span>{money(item.unitPrice)}</span>
          </div>
          <span className="line-quantity">x{item.quantity}</span>
        </li>
      ))}
    </ul>
  );
}
function Field({
  name,
  label,
  placeholder,
  autoComplete,
  type = 'text',
  wide = false,
  inputMode,
  maxLength,
  errors,
  onClearError,
}: {
  name: string;
  label: string;
  placeholder: string;
  autoComplete?: string;
  type?: string;
  wide?: boolean;
  inputMode?: 'numeric' | 'tel' | 'email';
  maxLength?: number;
  errors: Record<string, string>;
  onClearError: (name: string) => void;
}) {
  return (
    <div className={`form-field ${wide ? 'field-wide' : ''} ${errors[name] ? 'has-error' : ''}`}>
      <div>
        <label htmlFor={name}>{label}</label>
        {errors[name] && <span id={`${name}-error`}>{errors[name]}</span>}
      </div>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength ?? (name === 'address' ? 200 : 100)}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        required
        onInput={() => {
          if (errors[name]) onClearError(name);
        }}
      />
    </div>
  );
}

export function Checkout() {
  const { items, openCart } = useShop();
  const router = useRouter();
  const [method, setMethod] = useState<'e-money' | 'cash'>('e-money');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [expanded, setExpanded] = useState(false);
  const attempt = useRef<{ key: string; payload: string } | null>(null);
  const quote = items.length ? quoteCart(items) : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const customer = Object.fromEntries(
      ['name', 'email', 'phone', 'address', 'zip', 'city', 'country'].map((key) => [
        key,
        fields.get(key) ?? '',
      ]),
    );
    const payment =
      method === 'cash'
        ? { method }
        : { method, number: fields.get('number') ?? '', pin: fields.get('pin') ?? '' };
    const result = checkoutSchema.safeParse({ customer, payment, items });
    if (!result.success) {
      const issues: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        issues[String(issue.path.at(-1))] = issue.message;
      });
      setErrors(issues);
      setFailure('Please check the highlighted fields.');
      const first = Object.keys(issues)[0];
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setFailure('');
    setPending(true);
    const payload = JSON.stringify(result.data);
    try {
      if (!attempt.current || attempt.current.payload !== payload)
        attempt.current = { key: createUuid(), payload };
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.current.key },
        body: payload,
        signal: AbortSignal.timeout(20000),
      });
      const data = (await response.json()) as Receipt & { error?: string };
      if (!response.ok) {
        if (response.status === 409) attempt.current = null;
        throw new Error(data.error ?? 'Unable to place your order. Please try again.');
      }
      setReceipt(data as Receipt);
      cartStore.clear();
      attempt.current = null;
    } catch (error) {
      setFailure(
        error instanceof Error && error.name !== 'TimeoutError'
          ? error.message
          : 'The connection timed out. Your cart is safe. Please retry.',
      );
    } finally {
      setPending(false);
    }
  }
  if (receipt)
    return (
      <main id="main" className="checkout-page">
        <div className="status-page wrap">
          <p className="eyebrow copper">Order saved</p>
          <h1>Here’s to better listening.</h1>
          <Link href="/" className="button button-primary">
            Back to home
          </Link>
        </div>
        <Modal
          label="Order confirmation"
          className="confirmation-modal"
          onClose={() => router.push('/')}
        >
          <div className="confirmation-icon">
            <Check size={30} />
          </div>
          <h2>
            Thank you
            <br />
            for your order
          </h2>
          <p>Your demo order has been saved. No payment was taken.</p>
          <p className="order-reference">Reference: {receipt.id.slice(0, 8).toUpperCase()}</p>
          <div className="confirmation-summary">
            <div>
              <SummaryLines
                quote={{ ...receipt, items: expanded ? receipt.items : receipt.items.slice(0, 1) }}
              />
              {receipt.items.length > 1 && (
                <button className="text-button view-more" onClick={() => setExpanded(!expanded)}>
                  {expanded ? 'View less' : `and ${receipt.items.length - 1} other item(s)`}
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
            <div className="confirmation-total">
              <span>Grand total</span>
              <strong>{money(receipt.grandTotal)}</strong>
            </div>
          </div>
          <button className="button button-primary w-full" onClick={() => router.push('/')}>
            Back to home
          </button>
        </Modal>
      </main>
    );
  if (!quote)
    return (
      <main id="main" className="status-page wrap">
        <p className="eyebrow copper">Your cart is empty</p>
        <h1>
          Find something
          <br />
          worth listening to.
        </h1>
        <p>Add a product to your cart to begin checkout.</p>
        <Link href="/headphones" className="button button-primary">
          Explore the collection
        </Link>
      </main>
    );
  return (
    <main id="main" className="checkout-page">
      <div className="wrap">
        <Link href="/" className="back-link">
          ← Continue shopping
        </Link>
        <form noValidate onSubmit={submit} className="checkout-grid">
          <section className="checkout-form">
            <p className="eyebrow copper">One step closer</p>
            <h1>Checkout</h1>
            <p className="demo-notice">
              <ShieldCheck size={18} /> Portfolio demo. Use fictional details. No real payments or
              emails.
            </p>
            <fieldset>
              <legend>Billing details</legend>
              <div className="field-grid">
                <Field
                  errors={errors}
                  onClearError={(name) => setErrors((previous) => ({ ...previous, [name]: '' }))}
                  name="name"
                  label="Name"
                  placeholder="Alex Johnson"
                  autoComplete="name"
                />
                <Field
                  errors={errors}
                  onClearError={(name) => setErrors((previous) => ({ ...previous, [name]: '' }))}
                  name="email"
                  label="Email address"
                  placeholder="alex@example.com"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                />
                <Field
                  errors={errors}
                  onClearError={(name) => setErrors((previous) => ({ ...previous, [name]: '' }))}
                  name="phone"
                  label="Phone number"
                  placeholder="+1 202 555 0146"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={25}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend>Shipping info</legend>
              <div className="field-grid">
                <Field
                  errors={errors}
                  onClearError={(name) => setErrors((previous) => ({ ...previous, [name]: '' }))}
                  name="address"
                  label="Your address"
                  placeholder="1137 Williams Avenue"
                  autoComplete="street-address"
                  wide
                />
                <Field
                  errors={errors}
                  onClearError={(name) => setErrors((previous) => ({ ...previous, [name]: '' }))}
                  name="zip"
                  label="ZIP / postal code"
                  placeholder="10001"
                  autoComplete="postal-code"
                  maxLength={20}
                />
                <Field
                  errors={errors}
                  onClearError={(name) => setErrors((previous) => ({ ...previous, [name]: '' }))}
                  name="city"
                  label="City"
                  placeholder="New York"
                  autoComplete="address-level2"
                />
                <Field
                  errors={errors}
                  onClearError={(name) => setErrors((previous) => ({ ...previous, [name]: '' }))}
                  name="country"
                  label="Country"
                  placeholder="United States"
                  autoComplete="country-name"
                />
              </div>
            </fieldset>
            <fieldset>
              <legend>Payment details</legend>
              <div className="payment-method">
                <span>Payment method</span>
                <div>
                  <label className={`radio-field ${method === 'e-money' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="method"
                      value="e-money"
                      checked={method === 'e-money'}
                      onChange={() => setMethod('e-money')}
                    />
                    <CreditCard size={17} /> e-Money (demo)
                  </label>
                  <label className={`radio-field ${method === 'cash' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="method"
                      value="cash"
                      checked={method === 'cash'}
                      onChange={() => setMethod('cash')}
                    />
                    <Wallet size={17} /> Cash on delivery
                  </label>
                </div>
              </div>
              {method === 'e-money' ? (
                <>
                  <p className="payment-hint">Use 123456789 and PIN 1234 to try the demo.</p>
                  <div className="field-grid">
                    <Field
                      errors={errors}
                      onClearError={(name) =>
                        setErrors((previous) => ({ ...previous, [name]: '' }))
                      }
                      name="number"
                      label="e-Money number"
                      placeholder="123456789"
                      inputMode="numeric"
                      maxLength={9}
                      autoComplete="off"
                    />
                    <Field
                      errors={errors}
                      onClearError={(name) =>
                        setErrors((previous) => ({ ...previous, [name]: '' }))
                      }
                      name="pin"
                      label="e-Money PIN"
                      placeholder="1234"
                      inputMode="numeric"
                      type="password"
                      maxLength={4}
                      autoComplete="off"
                    />
                  </div>
                </>
              ) : (
                <p className="cash-description">
                  <Wallet size={40} strokeWidth={1.2} />
                  The cash on delivery option allows you to pay when your order arrives. This
                  portfolio checkout saves a demo order only; no products will be shipped.
                </p>
              )}
            </fieldset>
          </section>
          <aside className="checkout-summary">
            <div className="flex items-center justify-between">
              <h2>Summary</h2>
              <button type="button" className="text-button" onClick={openCart}>
                Edit cart
              </button>
            </div>
            <SummaryLines quote={quote} />
            <Totals quote={quote} />
            {failure && (
              <p className="form-failure" role="alert">
                {failure}
              </p>
            )}
            <button className="button button-primary w-full" type="submit" disabled={pending}>
              {pending ? 'Saving your order…' : 'Place demo order'}
            </button>
            <p className="summary-note">
              <ShieldCheck size={14} /> No payment will be collected.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
