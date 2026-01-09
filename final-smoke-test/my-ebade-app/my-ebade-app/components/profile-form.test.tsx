import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProfileForm } from './profile-form';
import React from 'react';

describe('ProfileForm Component', () => {
  it('renders without crashing', () => {
    render(<ProfileForm />);
    expect(document.body).toBeDefined();
  });
});