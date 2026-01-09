import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Testimonials } from './testimonials';
import React from 'react';

describe('Testimonials Component', () => {
  it('renders without crashing', () => {
    render(<Testimonials />);
    expect(document.body).toBeDefined();
  });
});