import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { QuickActions } from './quick-actions';
import React from 'react';

describe('QuickActions Component', () => {
  it('renders without crashing', () => {
    render(<QuickActions />);
    expect(document.body).toBeDefined();
  });
});