import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { NotificationPreferences } from './notification-preferences';
import React from 'react';

describe('NotificationPreferences Component', () => {
  it('renders without crashing', () => {
    render(<NotificationPreferences />);
    expect(document.body).toBeDefined();
  });
});