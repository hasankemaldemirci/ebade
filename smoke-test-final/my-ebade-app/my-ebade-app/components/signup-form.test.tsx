import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SignupForm } from './signup-form';
import React from 'react';

describe('SignupForm Component', () => {
  it('renders without crashing', () => {
    render(<SignupForm />);
    expect(document.body).toBeDefined();
  });
});