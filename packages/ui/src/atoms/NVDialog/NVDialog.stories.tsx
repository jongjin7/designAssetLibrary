import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  NVDialog, 
  NVDialogTrigger, 
  NVDialogContent,
  NVDialogHeader,
  NVDialogFooter,
  NVDialogTitle,
  NVDialogDescription,
  NVDialogBody
} from './index';
import { NVButton } from '../NVButton';
import { NVInput } from '../NVInput';
import { NVField } from '../NVField';
import { NVNotice } from '../NVNotice';
import { cn } from '../../lib/utils';
import { 
  AlertCircle, 
  Trash2, 
  CheckCircle2, 
  Info, 
  LayoutGrid, 
  Settings, 
  Shield, 
  User, 
  LogOut,
  Image as ImageIcon,
  Tag
} from 'lucide-react';

import { NVGlassPanel } from '../NVGlassPanel';
import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta<typeof NVDialog> = {
  title: 'Atoms/Dialog (Modal)',
  component: NVDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '사용자의 주의를 환기시키거나 중요한 결정을 내리게 하는 모달 다이얼로그입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVDialog>;

/**
 * 스토리북 프리뷰용 정적 다이얼로그 컨테이너입니다.
 */
const StaticDialogContainer = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <NVGlassPanel 
    theme="dark" 
    variant="modal" 
    noPadding 
    className={cn("w-full max-w-lg mx-auto overflow-hidden", className)}
  >
    {children}
  </NVGlassPanel>
);

/**
 * 전형적인 확인(Confirm) 다이얼로그 패턴입니다. 
 * 정돈된 Spacing과 함께 Ant Design 패턴의 아이콘 배치를 차용했습니다.
 */
export const ConfirmPattern: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-slate-950 min-h-[400px] relative overflow-hidden rounded-[32px] border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="relative z-10 w-full flex justify-center">
        <StaticDialogContainer className="max-w-md">
          <NVDialogHeader className="flex-row items-center gap-5 pt-7 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
               <Trash2 size={24} />
            </div>
            <div className="space-y-1.5 flex-1 pr-4">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-white">에셋 영구 삭제</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                'main_layout_final.psd' 에셋을 삭제하시겠습니까? 삭제된 후에는 라이브러리에서 복구가 불가능합니다.
              </p>
            </div>
          </NVDialogHeader>
          <NVDialogBody>
            <NVNotice variant="error">
              영향: 영구 삭제 시 팀원들과 공유 중인 모든 에셋 링크가 만료됩니다.
            </NVNotice>
          </NVDialogBody>
          <NVDialogFooter>
            <NVButton variant="secondary" size="sm">아니오, 보관하겠습니다</NVButton>
            <NVButton variant="primary" size="sm" className="bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg shadow-rose-500/10">네, 삭제합니다</NVButton>
          </NVDialogFooter>
        </StaticDialogContainer>
      </div>
    </div>
  ),
};

/**
 * 가벼운 입력(Simple Input) 패턴입니다. 
 * 복잡한 폼 대신 닉네임 설정이나 간단한 정보 입력을 위한 구성입니다.
 */
export const SimplePattern: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-slate-950 min-h-[400px] relative overflow-hidden rounded-[32px] border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="relative z-10 w-full flex justify-center">
        <StaticDialogContainer className="max-w-md">
          <NVDialogHeader>
            <h2 className="text-lg font-bold text-white">닉네임 설정</h2>
            <p className="text-sm text-slate-400">커뮤니티에서 사용할 이름을 입력해 주세요.</p>
          </NVDialogHeader>
          <NVDialogBody>
            <NVField label="새 닉네임" size="sm">
              <NVInput placeholder="최대 12자까지 입력..." className="w-full" size="md" />
            </NVField>
          </NVDialogBody>
          <NVDialogFooter>
            <NVButton variant="secondary" size="sm">취소</NVButton>
            <NVButton variant="primary" size="sm" className="px-6">저장하기</NVButton>
          </NVDialogFooter>
        </StaticDialogContainer>
      </div>
    </div>
  ),
};

/**
 * 대형 콘텐츠(Large Display) 패턴입니다. 
 * Apple 디자인 가이드라인처럼 시원한 타이포그래피와 글래스 배경을 강조합니다.
 */
export const LargePattern: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-slate-950 min-h-[600px] relative overflow-hidden rounded-[40px] border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="relative z-10 w-full flex justify-center">
        <StaticDialogContainer className="max-w-2xl px-0">
          <NVDialogHeader className="px-8 pt-10 pb-6 border-none">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center text-white">
                <CheckCircle2 size={14} />
              </div>
              <span className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">Update 2.4.0</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white mb-3">AI 필터링이 찾아온 리뉴얼된 라이브러리</h2>
            <p className="text-lg leading-relaxed text-slate-300">
               이미지에 담긴 색상과 형태를 AI가 분석하여 수만 개의 에셋도 단 몇 초 만에 찾아낼 수 있습니다.
            </p>
          </NVDialogHeader>
          
          <NVDialogBody className="px-8 pb-10 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: LayoutGrid, title: '스마트 최적화', desc: 'AI가 가장 좋은 그리드를 자동으로 제안합니다.', bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400' },
                { icon: Settings, title: '단축키 커스텀', desc: '생산성을 2배 이상 높여주는 매크로 기능을 사용하세요.', bgColor: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
              ].map(item => (
                <div key={item.title} className="p-7 bg-white/[0.04] border border-white/5 rounded-[28px] space-y-3.5 hover:bg-white/[0.07] transition-all group">
                  <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.iconColor} mb-2 group-hover:scale-110 transition-transform`}>
                     <item.icon size={24} />
                  </div>
                  <h4 className="font-bold text-white text-lg">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </NVDialogBody>
          
          <NVDialogFooter className="px-8 py-8 border-none bg-transparent">
             <NVButton variant="primary" size="lg" className="w-full rounded-2xl font-bold shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all">
                업데이트 시작하기
             </NVButton>
          </NVDialogFooter>
        </StaticDialogContainer>
      </div>
    </div>
  ),
};

/**
 * 시스템 단순 얼럿(Alert States) 패턴입니다.
 */
export const AlertStates: Story = {
  render: () => {
    const states = [
      { id: 'info', icon: Info, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', title: '정보 안내', desc: '새로운 에셋 업데이트 소식이 있습니다.' },
      { id: 'success', icon: CheckCircle2, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', title: '처리 완료', desc: '에셋 등록이 안전하게 완료되었습니다.' },
      { id: 'warning', icon: AlertCircle, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', title: '주의 사항', desc: '라이브러리 공간이 거의 가득 찼습니다.' },
      { id: 'error', icon: Trash2, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', title: '오류 발생', desc: '지원하지 않는 파일 형식입니다. (EPS)' },
    ];

    return (
      <div className="grid grid-cols-2 gap-10 p-12 bg-slate-950 min-h-[650px] relative overflow-hidden rounded-[40px] border border-white/5">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${showcaseBg})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/60" />
        
        {states.map(state => (
          <div key={state.id} className="relative flex flex-col items-center justify-center">
            <div className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-2xl transition-all hover:translate-y-[-4px] hover:bg-slate-950/50">
              <div className="p-7 pb-5 text-center">
                <div className={`w-12 h-12 rounded-xl ${state.bgColor} flex items-center justify-center ${state.iconColor} mx-auto mb-5 shadow-lg shadow-black/20`}>
                  <state.icon size={24} />
                </div>
                <div className="space-y-1.5 px-1">
                  <h3 className="text-base font-bold text-white tracking-tight">{state.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                    {state.desc}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-1">
                <NVButton variant="secondary" size="sm" className="w-full font-bold bg-white/[0.03] border-white/5 hover:bg-white/10">
                  확인
                </NVButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};
