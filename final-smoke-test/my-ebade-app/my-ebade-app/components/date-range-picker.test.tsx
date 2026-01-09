import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DateRangePicker } from './date-range-picker';
import React from 'react';

describe('DateRangePicker Component', () => {
  it('renders without crashing', () => {
    render(<DateRangePicker />);
    expect(document.body).toBeDefined();
  });
});