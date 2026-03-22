import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
  NVPopoverHeader,
  NVPopoverBody,
  NVPopoverFooter 
} from '../../atoms/NVPopover';
import { NVButton } from '../../atoms/NVButton';
import { NVIconButton } from '../../atoms/NVIconButton';
import { NVSwitch } from '../../atoms/NVSwitch';
import { NVSelect } from '../../atoms/NVSelect';
import { cn } from '../../lib/utils';
import { 
  Columns2, 
  ArrowUpAz, 
  ArrowDownAz, 
  RefreshCw,
  Maximize2,
  Settings,
  User,
  LogOut,
  Bell,
  Check,
  ChevronRight,
  Shield,
  LayoutGrid
} from 'lucide-react';

import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta = {
  title: 'Composition/QuickAccessPanels',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '실제 서비스에서 사용되는 다양한 팝업의 구성 예시입니다.',
      },
    },
  },
};

export default meta;

/**
 * 스토리북 프리뷰용 정적 팝업 컨테이너입니다.
 */
const StaticPopoverContainer = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <NVGlassPanel 
    theme="dark" 
    variant="modal" 
    noPadding 
    className={cn("w-72 mx-auto overflow-hidden", className)}
  >
    {children}
  </NVGlassPanel>
);

export const ViewOptions: StoryObj = {
  render: () => {
    const [showName, setShowName] = React.useState(true);
    const [showInfo, setShowInfo] = React.useState(true);
    
    return (
      <div className="flex justify-center p-20 bg-slate-950 min-h-[500px] relative overflow-hidden rounded-3xl border border-white/5">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${showcaseBg})` }} 
        />
        <div className="relative z-10 w-full flex justify-center">
          <StaticPopoverContainer className="w-72">
            <NVPopoverHeader>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">보기 옵션</h3>
            </NVPopoverHeader>
            <NVPopoverBody className="space-y-3.5 select-none">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">레이아웃</span>
                <NVSelect 
                  size="sm"
                  className="w-32"
                  icon={<Columns2 size={13} />}
                  defaultValue="both"
                  options={[
                    { value: 'both', label: '양쪽' },
                    { value: 'left', label: '왼쪽' },
                    { value: 'right', label: '오른쪽' },
                  ]}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">썸네일</span>
                <div className="flex p-0.5 rounded-lg border border-white/10 bg-white/5">
                  <button className="px-2.5 py-1 text-[11px] font-medium rounded-md text-slate-500 hover:text-slate-300 transition-colors">속도</button>
                  <button className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/10 text-white shadow-sm shadow-black/20">품질</button>
                </div>
              </div>

              <div className="h-[1px] bg-white/10 -mx-4" />

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-200 font-medium">이름 표시</span>
                  <NVSwitch checked={showName} onChange={setShowName} size="sm" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-200 font-medium">정보 표시</span>
                  <div className="flex items-center gap-2">
                    <NVSelect 
                      size="sm"
                      className="w-24"
                      icon={<Maximize2 size={11} />}
                      defaultValue="size"
                      options={[
                        { value: 'size', label: '규격' },
                        { value: 'weight', label: '용량' },
                      ]}
                    />
                    <NVSwitch checked={showInfo} onChange={setShowInfo} size="sm" />
                  </div>
                </div>
              </div>
            </NVPopoverBody>
            <NVPopoverFooter>
              <NVButton 
                variant="secondary"
                size="sm"
                className="w-full shadow-none bg-white/[0.03] hover:bg-white/[0.06] border-white/5"
              >
                <RefreshCw size={12} className="text-slate-500 mr-2" />
                설정 초기화
              </NVButton>
            </NVPopoverFooter>
          </StaticPopoverContainer>
        </div>
      </div>
    );
  }
};

export const ProfileCard: StoryObj = {
  render: () => (
    <div className="flex justify-center p-20 bg-slate-950 min-h-[400px] relative overflow-hidden rounded-3xl border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-rose-500/10 opacity-50" />
      <div className="relative z-10 w-full flex justify-center">
        <StaticPopoverContainer className="w-64">
          <NVPopoverBody className="p-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 mb-3 flex items-center justify-center text-2xl border border-white/10 shadow-inner">👨‍🚀</div>
            <h3 className="text-sm font-bold text-white">John Doe</h3>
            <p className="text-[11px] text-slate-500 mb-4">john.doe@nova-design.com</p>
            
            <div className="w-full space-y-1">
              {[
                { icon: User, label: '내 프로필' },
                { icon: Settings, label: '계정 설정' },
                { icon: Shield, label: '보안 및 권한' },
              ].map(item => (
                <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left group">
                  <item.icon size={14} className="group-hover:text-indigo-400 transition-colors" />
                  {item.label}
                  <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 transition-transform" />
                </button>
              ))}
            </div>
          </NVPopoverBody>
          <NVPopoverFooter className="p-2 bg-rose-500/5 justify-start">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-all text-left font-medium active:scale-[0.98]">
              <LogOut size={14} />
              로그아웃
            </button>
          </NVPopoverFooter>
        </StaticPopoverContainer>
      </div>
    </div>
  ),
};

export const Notifications: StoryObj = {
  render: () => (
    <div className="flex justify-center p-20 bg-slate-950 min-h-[400px] relative overflow-hidden rounded-3xl border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-cyan-500/10 opacity-50" />
      <div className="relative z-10 w-full flex justify-center">
        <StaticPopoverContainer className="w-80">
          <NVPopoverHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">알림</h3>
            </div>
            <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors">전체 읽음</button>
          </NVPopoverHeader>
          <div className="max-h-80 overflow-y-auto scrollbar-hide">
            {[
              { id: 1, title: '에셋 업로드가 완료되었습니다.', time: '방금 전', meta: 'main_kv_image.png (2.4MB)' },
              { id: 2, title: '새로운 시스템 업데이트 안내', time: '1시간 전', meta: 'v1.2.4 버전이 릴리즈되었습니다.' },
              { id: 3, title: '피드백이 도착했습니다.', time: '2시간 전', meta: 'jongjin 님이 댓글을 남겼습니다.' },
            ].map(item => (
              <div key={item.id} className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group active:bg-white/5">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center flex-shrink-0 text-indigo-400 border border-indigo-500/20 shadow-sm">
                    <Check size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] text-white font-medium leading-tight group-hover:text-indigo-200 transition-colors">{item.title}</p>
                    <div className="flex items-center gap-2 divide-x divide-white/10">
                      <p className="text-[11px] text-slate-500">{item.time}</p>
                      <p className="text-[11px] text-slate-400 pl-2">{item.meta}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <NVPopoverFooter className="justify-center bg-white/[0.01]">
            <button className="text-[11px] text-slate-500 hover:text-slate-200 py-1 transition-colors font-medium">이전 알림 모두 보기</button>
          </NVPopoverFooter>
        </StaticPopoverContainer>
      </div>
    </div>
  ),
};
