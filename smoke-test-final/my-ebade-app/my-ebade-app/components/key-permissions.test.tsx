import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { KeyPermissions } from './key-permissions';
import React from 'react';

describe('KeyPermissions Component', () => {
  it('renders without crashing', () => {
    render(<KeyPermissions />);
    expect(document.body).toBeDefined();
  });
});