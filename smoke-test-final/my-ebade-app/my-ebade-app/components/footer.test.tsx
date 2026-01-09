import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './footer';
import React from 'react';

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(document.body).toBeDefined();
  });
});