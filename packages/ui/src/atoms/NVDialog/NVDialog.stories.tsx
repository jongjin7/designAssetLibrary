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
import { NVFormGroup } from '../NVFormGroup';
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
          <NVDialogFooter className="py-4">
            <NVButton variant="secondary" size="md">아니오, 보관하겠습니다</NVButton>
            <NVButton variant="primary" size="md" className="bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg shadow-rose-500/10">네, 삭제합니다</NVButton>
          </NVDialogFooter>
        </StaticDialogContainer>
      </div>
    </div>
  ),
};

/**
 * 리소스 생성(Resource Creation) 패턴입니다. 
 * Shopify Polaris나 Atlassian 시스템의 폼 대화상자처럼 
 * NVFormGroup을 사용하여 정돈된 폼을 구성합니다.
 */
export const FormPattern: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-slate-950 min-h-[600px] relative overflow-hidden rounded-[32px] border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="relative z-10 w-full flex justify-center">
        <StaticDialogContainer className="max-w-lg">
          <NVDialogHeader>
            <h2 className="text-lg font-bold leading-tight tracking-tight text-white">새 에셋 등록</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed">라이브러리에 로드할 에셋의 정보를 입력해 주세요.</p>
          </NVDialogHeader>
          <NVDialogBody className="space-y-6">
            <div className="w-full aspect-video rounded-3xl bg-white/[0.03] border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group">
               <ImageIcon size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
               <span className="text-xs font-medium group-hover:text-slate-300">이미지 또는 비디오 업로드</span>
            </div>
            
            <div className="grid grid-cols-1 gap-5 pt-2">
              <NVFormGroup label="에셋 이름" spacing="sm">
                <NVInput placeholder="에셋 제목 입력..." className="w-full" size="md" />
              </NVFormGroup>
              
              <NVFormGroup label="태그 추가" spacing="sm">
                <NVInput icon={<Tag size={14} />} placeholder="태그 입력 (Enter)" className="w-full" size="md" />
              </NVFormGroup>
            </div>
          </NVDialogBody>
          <NVDialogFooter className="py-4">
            <NVButton variant="ghost" size="sm" className="mr-auto text-slate-500">나중에 하기</NVButton>
            <NVButton variant="secondary" size="sm">임시 저장</NVButton>
            <NVButton variant="primary" size="sm" className="px-5">등록 완료</NVButton>
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
             <NVButton variant="primary" className="w-full h-14 rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all">
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
      { id: 'info', icon: Info, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400', title: '정보 안내', desc: '새로운 에셋 업데이트가 있습니다.' },
      { id: 'success', icon: CheckCircle2, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-400', title: '처리 완료', desc: '에셋 등록이 완료되었습니다.' },
      { id: 'warning', icon: AlertCircle, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-400', title: '주의 사항', desc: '라이브러리 용량이 부족합니다.' },
      { id: 'error', icon: Trash2, bgColor: 'bg-rose-500/10', iconColor: 'text-rose-400', title: '오류 발생', desc: '지원하지 않는 파일 형식입니다.' },
    ];

    return (
      <div className="grid grid-cols-2 gap-8 p-10 bg-slate-950 min-h-[600px] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${showcaseBg})` }} 
        />
        {states.map(state => (
          <div key={state.id} className="relative flex flex-col items-center">
            <div className="w-full max-w-[280px] overflow-hidden text-center rounded-[32px] border border-white/15 bg-slate-950/60 backdrop-blur-2xl shadow-3xl">
              <div className="p-6 pb-5 space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${state.bgColor} flex items-center justify-center ${state.iconColor} mx-auto mb-1`}>
                  <state.icon size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">{state.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed px-2">
                    {state.desc}
                  </p>
                </div>
              </div>
              <div className="h-[1px] bg-white/10" />
              <div className="p-2.5">
                <button className={`w-full h-11 bg-white/5 hover:bg-white/10 text-slate-200 border-none rounded-2xl font-bold transition-all text-sm active:scale-95`}>
                  확인
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};
