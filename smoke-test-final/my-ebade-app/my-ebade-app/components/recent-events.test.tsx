import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RecentEvents } from './recent-events';
import React from 'react';

describe('RecentEvents Component', () => {
  it('renders without crashing', () => {
    render(<RecentEvents />);
    expect(document.body).toBeDefined();
  });
});