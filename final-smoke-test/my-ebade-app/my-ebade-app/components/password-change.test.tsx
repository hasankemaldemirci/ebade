import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PasswordChange } from './password-change';
import React from 'react';

describe('PasswordChange Component', () => {
  it('renders without crashing', () => {
    render(<PasswordChange />);
    expect(document.body).toBeDefined();
  });
});