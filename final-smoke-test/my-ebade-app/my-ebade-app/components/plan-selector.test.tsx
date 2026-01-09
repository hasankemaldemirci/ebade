import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PlanSelector } from './plan-selector';
import React from 'react';

describe('PlanSelector Component', () => {
  it('renders without crashing', () => {
    render(<PlanSelector />);
    expect(document.body).toBeDefined();
  });
});