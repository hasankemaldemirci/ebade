import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CreateKeyModal } from './create-key-modal';
import React from 'react';

describe('CreateKeyModal Component', () => {
  it('renders without crashing', () => {
    render(<CreateKeyModal />);
    expect(document.body).toBeDefined();
  });
});