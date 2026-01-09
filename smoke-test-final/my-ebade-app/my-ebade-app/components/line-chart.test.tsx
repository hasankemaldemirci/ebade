import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LineChart } from './line-chart';
import React from 'react';

describe('LineChart Component', () => {
  it('renders without crashing', () => {
    render(<LineChart />);
    expect(document.body).toBeDefined();
  });
});