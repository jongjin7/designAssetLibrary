'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Smartphone, KeyRound, ScanLine, LogOut, AlertTriangle } from 'lucide-react';
import { NVButton, NVCard } from '@nova/ui';
import { SettingsPageShell, SettingsPageHeader } from '@nova/components/shared/settings/SettingsPageShell';
import { SettingsSwitchRow, SettingsDangerItem } from '@nova/components/shared/settings/SettingsComponents';

const MOCK_SESSIONS = [
  { id: '1', device: 'MacBook Pro · Chrome', location: 'Seoul, KR', time: '현재 세션', current: true },
  { id: '2', device: 'iPhone 15 Pro · Safari', location: 'Seoul, KR', time: '2시간 전', current: false },
  { id: '3', device: 'Windows PC · Edge', location: 'Busan, KR', time: '3일 전', current: false },
];

function SecurityContent({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();

  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [exifFilter, setExifFilter] = useState(true);

  return (
    <section className={`py-3 ${!isMobile ? 'max-w-[720px] mx-auto w-full' : ''}`}>
      <SettingsPageHeader
        title="보안 정책"
        subtitle="계정 보안 및 접근 권한을 관리합니다"
        isMobile={isMobile}
      />

      <div className={`${isMobile ? 'px-5' : ''} flex flex-col gap-5`}>

        {/* 보안 상태 배지 */}
        <NVCard
          className="!p-5 !bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08)_0%,rgba(255,255,255,0.01)_100%)] border-indigo-500/10"
          hoverEffect={false}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-300">보안 상태: 양호</p>
              <p className="text-xs text-slate-500 mt-0.5">2단계 인증이 활성화되어 있습니다</p>
            </div>
          </div>
        </NVCard>

        {/* 인증 */}
        <NVCard className="!p-5" hoverEffect={false}>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 opacity-70">인증</h4>
          <div className="flex flex-col gap-1">
            <SettingsSwitchRow
              icon={Smartphone}
              label="2단계 인증 (2FA)"
              sub="로그인 시 추가 인증 코드가 필요합니다"
              checked={twoFactor}
              onChange={setTwoFactor}
            />
            <SettingsSwitchRow
              icon={ScanLine}
              label="생체 인증"
              sub="Touch ID / Face ID로 빠르게 잠금 해제"
              checked={biometric}
              onChange={setBiometric}
            />
            <button className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left hover:bg-white/[0.06] transition-all">
              <KeyRound size={17} className="text-slate-400 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-100">비밀번호 변경</p>
                <p className="text-xs text-slate-500 mt-0.5">마지막 변경: 30일 이상 전</p>
              </div>
              <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">변경 →</span>
            </button>
          </div>
        </NVCard>

        {/* 파일 보안 · EXIF */}
        <NVCard className="!p-5" hoverEffect={false}>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 opacity-70">파일 보안</h4>
          <div className="flex flex-col gap-1">
            <SettingsSwitchRow
              icon={ScanLine}
              label="EXIF 자동 필터링"
              sub="업로드 파일의 GPS·촬영 정보 등 메타데이터를 자동 삭제합니다"
              checked={exifFilter}
              onChange={setExifFilter}
            />
          </div>
        </NVCard>

        {/* 활성 세션 */}
        <NVCard className="!p-5" hoverEffect={false}>
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider opacity-70">활성 세션</h4>
            <button className="text-xs text-red-400/70 hover:text-red-400 transition-colors font-medium">
              모두 로그아웃
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {MOCK_SESSIONS.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${session.current ? 'bg-green-400' : 'bg-slate-600'}`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{session.device}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{session.location} · {session.time}</p>
                  </div>
                </div>
                {!session.current && (
                  <button className="flex-shrink-0 ml-3 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </NVCard>

        {/* 위험 구역 */}
        <NVCard className="!p-5 border-red-500/10" hoverEffect={false}>
          <h4 className="text-xs font-bold text-red-500/60 uppercase tracking-wider mb-5 opacity-70">위험 구역</h4>
          <SettingsDangerItem
            icon={AlertTriangle}
            label="모든 세션 종료 및 토큰 무효화"
            sub="현재 기기를 제외한 모든 로그인을 강제 종료합니다"
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

export default function SecuritySettingsPage() {
  return (
    <SettingsPageShell>
      {(isMobile) => <SecurityContent isMobile={isMobile} />}
    </SettingsPageShell>
  );
}
