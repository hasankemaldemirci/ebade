import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CtaBanner } from './cta-banner';
import React from 'react';

describe('CtaBanner Component', () => {
  it('renders without crashing', () => {
    render(<CtaBanner />);
    expect(document.body).toBeDefined();
  });
});