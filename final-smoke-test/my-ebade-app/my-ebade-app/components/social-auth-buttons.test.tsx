import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SocialAuthButtons } from './social-auth-buttons';
import React from 'react';

describe('SocialAuthButtons Component', () => {
  it('renders without crashing', () => {
    render(<SocialAuthButtons />);
    expect(document.body).toBeDefined();
  });
});