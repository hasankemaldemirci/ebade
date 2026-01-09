import React from 'react';
import { TeamMembersList } from '@/components/team-members-list';
import { InviteMemberModal } from '@/components/invite-member-modal';
import { RoleSelector } from '@/components/role-selector';
import { PendingInvites } from '@/components/pending-invites';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/dashboard/team')
 * @intent('team-management')
 */
export default function TeamManagementPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">TeamManagement</h1>
          <p className="text-sm opacity-40 mt-1">Route: /dashboard/team</p>
        </header>
        
        <main className="space-y-12">
          <TeamMembersList />
          <InviteMemberModal />
          <RoleSelector />
          <PendingInvites />
        </main>
      </div>
    </div>
  );
}

// Auth: required