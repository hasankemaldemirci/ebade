import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ActivityChart } from './activity-chart';
import React from 'react';

describe('ActivityChart Component', () => {
  it('renders without crashing', () => {
    render(<ActivityChart />);
    expect(document.body).toBeDefined();
  });
});