import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RoleSelector } from './role-selector';
import React from 'react';

describe('RoleSelector Component', () => {
  it('renders without crashing', () => {
    render(<RoleSelector />);
    expect(document.body).toBeDefined();
  });
});