import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MetricsCards } from './metrics-cards';
import React from 'react';

describe('MetricsCards Component', () => {
  it('renders without crashing', () => {
    render(<MetricsCards />);
    expect(document.body).toBeDefined();
  });
});