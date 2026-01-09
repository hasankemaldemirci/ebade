import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { InviteMemberModal } from './invite-member-modal';
import React from 'react';

describe('InviteMemberModal Component', () => {
  it('renders without crashing', () => {
    render(<InviteMemberModal />);
    expect(document.body).toBeDefined();
  });
});