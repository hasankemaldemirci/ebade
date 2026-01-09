import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ConnectedAccounts } from './connected-accounts';
import React from 'react';

describe('ConnectedAccounts Component', () => {
  it('renders without crashing', () => {
    render(<ConnectedAccounts />);
    expect(document.body).toBeDefined();
  });
});