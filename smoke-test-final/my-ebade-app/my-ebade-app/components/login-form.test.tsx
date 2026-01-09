import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoginForm } from './login-form';
import React from 'react';

describe('LoginForm Component', () => {
  it('renders without crashing', () => {
    render(<LoginForm />);
    expect(document.body).toBeDefined();
  });
});