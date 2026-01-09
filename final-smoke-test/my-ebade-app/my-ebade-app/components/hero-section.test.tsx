import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeroSection } from './hero-section';
import React from 'react';

describe('HeroSection Component', () => {
  it('renders without crashing', () => {
    render(<HeroSection />);
    expect(document.body).toBeDefined();
  });
});