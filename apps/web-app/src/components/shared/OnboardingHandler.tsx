'use client';

import React, { useEffect, useState } from 'react';
import { NVOnboarding } from '@nova/ui';
import { useAuth } from '@nova/providers/AuthProvider';
import { opfsStorage } from '@nova/lib/storage/opfs';
import { assetRepository } from '@nova/lib/dataService';
import { useToast } from '@nova/ui';
import { warmUpModel } from '@nova/lib/classificationService';

export function OnboardingHandler() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only show onboarding for logged-in users who haven't seen it
    if (!user || isInitialized) return;

    const hasCompletedOnboarding = localStorage.getItem('nova_onboarding_completed');

    // Pre-warm AI model for faster first analysis
    warmUpModel();
    
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
      
      // Auto-setup OPFS while user is onboarding
      // This ensures the directory is requested and ready
      (async () => {
        try {
          console.log('[Onboarding] Triggering automatic OPFS initialization...');
          await opfsStorage.prepareStorage();
          // Just calling getAssets triggers initialize() in MockAssetRepository
          // which in turn ensures OPFS/IDB are ready
          await assetRepository.getAssets();
          console.log('[Onboarding] Local library setup automated.');
        } catch (e) {
          console.error('[Onboarding] Auto-setup failed:', e);
        }
      })();
    }
    
    setIsInitialized(true);
  }, [user, isInitialized]);

  const handleComplete = () => {
    localStorage.setItem('nova_onboarding_completed', 'true');
    setShowOnboarding(false);
    toast('모든 준비가 끝났습니다. 환영합니다!', {
      type: 'success'
    });
  };

  if (!showOnboarding) return null;

  return <NVOnboarding isOpen={showOnboarding} onComplete={handleComplete} />;
}
