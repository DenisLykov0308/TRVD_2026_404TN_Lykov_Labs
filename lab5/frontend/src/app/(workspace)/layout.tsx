import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppHeader } from '@/components/layout/app-header';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="workspace-layout">
        <AppHeader />
        <main className="workspace-content">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
