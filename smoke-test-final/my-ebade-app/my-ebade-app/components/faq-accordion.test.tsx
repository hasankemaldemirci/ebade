import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FaqAccordion } from './faq-accordion';
import React from 'react';

describe('FaqAccordion Component', () => {
  it('renders without crashing', () => {
    render(<FaqAccordion />);
    expect(document.body).toBeDefined();
  });
});