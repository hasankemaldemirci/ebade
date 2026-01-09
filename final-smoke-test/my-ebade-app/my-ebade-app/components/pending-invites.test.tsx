import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PendingInvites } from './pending-invites';
import React from 'react';

describe('PendingInvites Component', () => {
  it('renders without crashing', () => {
    render(<PendingInvites />);
    expect(document.body).toBeDefined();
  });
});