import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FeatureGrid } from './feature-grid';
import React from 'react';

describe('FeatureGrid Component', () => {
  it('renders without crashing', () => {
    render(<FeatureGrid />);
    expect(document.body).toBeDefined();
  });
});