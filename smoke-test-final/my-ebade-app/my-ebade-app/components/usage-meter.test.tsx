import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { UsageMeter } from './usage-meter';
import React from 'react';

describe('UsageMeter Component', () => {
  it('renders without crashing', () => {
    render(<UsageMeter />);
    expect(document.body).toBeDefined();
  });
});