export const validCheckout = {
  customer: {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 202 555 0146',
    address: '1137 Williams Avenue',
    zip: '10001',
    city: 'New York',
    country: 'United States',
  },
  items: [{ productId: 4, quantity: 2 }],
  payment: { method: 'cash' as const },
};
