'use client';

import { SettingsContent } from '@nova/components/shared/settings/SettingsContent';
import { SettingsPageShell } from '@nova/components/shared/settings/SettingsPageShell';
import { useAuth } from '@nova/providers/AuthProvider';

export default function ProfileSettingsPage() {
  const { signOut } = useAuth();

  return (
    <SettingsPageShell maxWidth={1200}>
      {(isMobile) => (
        <SettingsContent isMobile={isMobile} onLogout={signOut} />
      )}
    </SettingsPageShell>
  );
}
