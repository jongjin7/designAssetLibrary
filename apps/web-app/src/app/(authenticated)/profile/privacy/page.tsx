'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Camera, Globe, Eye, Trash2 } from 'lucide-react';
import { NVButton, NVInput, NVCard, NVField } from '@nova/ui';
import { SettingsPageShell, SettingsPageHeader } from '@nova/components/shared/settings/SettingsPageShell';
import { SettingsSwitchRow, SettingsDangerItem } from '@nova/components/shared/settings/SettingsComponents';
import { useAuth } from '@nova/providers/AuthProvider';

function PrivacyContent({ isMobile }: { isMobile: boolean }) {
  const { profile } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile?.name ?? '');
  const [profilePublic, setProfilePublic] = useState(true);
  const [activityVisible, setActivityVisible] = useState(false);

  return (
    <section className={`py-3 ${!isMobile ? 'max-w-[720px] mx-auto w-full' : ''}`}>
      <SettingsPageHeader
        title="개인정보 설정"
        subtitle="프로필 정보 및 공개 범위를 관리합니다"
        isMobile={isMobile}
      />

      <div className={`${isMobile ? 'px-5' : ''} flex flex-col gap-5`}>

        {/* 프로필 정보 */}
        <NVCard className="!p-5" hoverEffect={false}>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 opacity-70">
            프로필 정보
          </h4>

          {/* 아바타 */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/[0.06]">
            <div className="w-16 h-16 rounded-[16px] bg-gradient-to-br from-[#6f8fff] to-[#3058a0] flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile?.name ?? '사용자'}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{profile?.email}</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.10] hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
              <Camera size={13} />
              변경
            </button>
          </div>

          {/* 폼 필드 */}
          <div className="flex flex-col gap-4">
            <NVField
              label="표시 이름"
              htmlFor="displayName"
              size="sm"
              labelClassName="text-xs font-semibold text-slate-400"
            >
              <>
                <NVInput
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="표시할 이름을 입력하세요"
                  size="lg"
                />
                <p className="text-xs text-slate-600">워크스페이스와 공유 화면에서 표시되는 이름입니다.</p>
              </>
            </NVField>

            <NVField
              label="이메일 주소"
              htmlFor="email"
              size="sm"
              labelClassName="text-xs font-semibold text-slate-400"
            >
              <>
                <NVInput
                  id="email"
                  value={profile?.email ?? ''}
                  readOnly
                  disabled
                  size="lg"
                />
                <p className="text-xs text-slate-600">이메일 변경은 계정 인증이 필요합니다.</p>
              </>
            </NVField>
          </div>
        </NVCard>

        {/* 공개 범위 */}
        <NVCard className="!p-5" hoverEffect={false}>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 opacity-70">
            공개 범위
          </h4>
          <div className="flex flex-col gap-1">
            <SettingsSwitchRow
              icon={Globe}
              label="프로필 공개"
              sub="워크스페이스 멤버에게 내 프로필을 공개합니다"
              checked={profilePublic}
              onChange={setProfilePublic}
            />
            <SettingsSwitchRow
              icon={Eye}
              label="활동 기록 공개"
              sub="업로드 및 태그 활동을 다른 멤버가 볼 수 있습니다"
              checked={activityVisible}
              onChange={setActivityVisible}
            />
          </div>
        </NVCard>

        {/* 위험 구역 */}
        <NVCard className="!p-5 border-red-500/10" hoverEffect={false}>
          <h4 className="text-xs font-bold text-red-500/60 uppercase tracking-wider mb-5 opacity-70">
            위험 구역
          </h4>
          <SettingsDangerItem
            icon={Trash2}
            label="계정 삭제"
            sub="모든 데이터가 영구적으로 삭제됩니다"
          />
        </NVCard>

        {/* 저장/취소 */}
        <div className={`flex gap-3 ${isMobile ? 'flex-col pb-6' : 'justify-end'}`}>
          <NVButton
            variant="neutral"
            size="md"
            onClick={() => router.back()}
            className={isMobile ? 'w-full' : ''}
          >
            취소
          </NVButton>
          <NVButton
            variant="primary"
            size="md"
            onClick={() => router.back()}
            className={isMobile ? 'w-full' : ''}
          >
            변경사항 저장
          </NVButton>
        </div>

      </div>
    </section>
  );
}

export default function PrivacySettingsPage() {
  return (
    <SettingsPageShell>
      {(isMobile) => <PrivacyContent isMobile={isMobile} />}
    </SettingsPageShell>
  );
}
