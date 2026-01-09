import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatsGrid } from './stats-grid';
import React from 'react';

describe('StatsGrid Component', () => {
  it('renders without crashing', () => {
    render(<StatsGrid />);
    expect(document.body).toBeDefined();
  });
});