import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CurrentPlanCard } from './current-plan-card';
import React from 'react';

describe('CurrentPlanCard Component', () => {
  it('renders without crashing', () => {
    render(<CurrentPlanCard />);
    expect(document.body).toBeDefined();
  });
});