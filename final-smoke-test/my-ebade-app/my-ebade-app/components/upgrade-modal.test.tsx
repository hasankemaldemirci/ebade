import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { UpgradeModal } from './upgrade-modal';
import React from 'react';

describe('UpgradeModal Component', () => {
  it('renders without crashing', () => {
    render(<UpgradeModal />);
    expect(document.body).toBeDefined();
  });
});