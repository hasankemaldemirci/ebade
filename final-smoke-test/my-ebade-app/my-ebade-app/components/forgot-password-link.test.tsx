import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ForgotPasswordLink } from './forgot-password-link';
import React from 'react';

describe('ForgotPasswordLink Component', () => {
  it('renders without crashing', () => {
    render(<ForgotPasswordLink />);
    expect(document.body).toBeDefined();
  });
});