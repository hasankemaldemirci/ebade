import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BarChart } from './bar-chart';
import React from 'react';

describe('BarChart Component', () => {
  it('renders without crashing', () => {
    render(<BarChart />);
    expect(document.body).toBeDefined();
  });
});