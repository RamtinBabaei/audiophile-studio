import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Quantity } from '@/components/store/quantity';
describe('quantity control', () => {
  it('prevents reducing below one and increasing above 99', () => {
    const change = vi.fn();
    const { rerender } = render(<Quantity value={1} onChange={change} />);
    expect(screen.getByRole('button', { name: 'Decrease Quantity' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Increase Quantity' }));
    expect(change).toHaveBeenCalledWith(2);
    rerender(<Quantity value={99} onChange={change} />);
    expect(screen.getByRole('button', { name: 'Increase Quantity' })).toBeDisabled();
  });
  it('allows zero to remove items from the cart', () => {
    const change = vi.fn();
    render(<Quantity value={1} min={0} onChange={change} label="XX99" />);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease XX99' }));
    expect(change).toHaveBeenCalledWith(0);
  });
});
