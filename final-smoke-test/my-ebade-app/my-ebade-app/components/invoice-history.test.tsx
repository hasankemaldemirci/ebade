import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { InvoiceHistory } from './invoice-history';
import React from 'react';

describe('InvoiceHistory Component', () => {
  it('renders without crashing', () => {
    render(<InvoiceHistory />);
    expect(document.body).toBeDefined();
  });
});