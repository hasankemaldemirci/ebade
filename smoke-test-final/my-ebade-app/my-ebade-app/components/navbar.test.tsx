import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Navbar } from './navbar';
import React from 'react';

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    render(<Navbar />);
    expect(document.body).toBeDefined();
  });
});