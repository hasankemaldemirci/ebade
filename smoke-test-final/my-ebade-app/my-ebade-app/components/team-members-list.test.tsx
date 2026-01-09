import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TeamMembersList } from './team-members-list';
import React from 'react';

describe('TeamMembersList Component', () => {
  it('renders without crashing', () => {
    render(<TeamMembersList />);
    expect(document.body).toBeDefined();
  });
});