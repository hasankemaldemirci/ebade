import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DataTable } from './data-table';
import React from 'react';

describe('DataTable Component', () => {
  it('renders without crashing', () => {
    render(<DataTable />);
    expect(document.body).toBeDefined();
  });
});