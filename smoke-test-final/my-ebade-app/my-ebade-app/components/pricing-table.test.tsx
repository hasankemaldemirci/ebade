import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PricingTable } from './pricing-table';
import React from 'react';

describe('PricingTable Component', () => {
  it('renders without crashing', () => {
    render(<PricingTable />);
    expect(document.body).toBeDefined();
  });
});