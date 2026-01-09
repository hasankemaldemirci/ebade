import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ApiKeysTable } from './api-keys-table';
import React from 'react';

describe('ApiKeysTable Component', () => {
  it('renders without crashing', () => {
    render(<ApiKeysTable />);
    expect(document.body).toBeDefined();
  });
});