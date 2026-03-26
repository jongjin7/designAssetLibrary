import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVSearchPanel } from './NVSearchPanel';
import { Search, Settings2 } from 'lucide-react';
import { NVButton } from '../../atoms/NVButton';
import { NVIconButton } from '../../atoms/NVIconButton';
import { NVPopover, NVPopoverTrigger, NVPopoverContent } from '../../atoms/NVPopover';

const meta: Meta<typeof NVSearchPanel> = {
  title: 'Composition/SearchPanel',
  component: NVSearchPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '데스크탑 자산 라이브러리의 상세 검색을 위한 전용 패널입니다. 가로형 레이아웃과 정교한 필터 컨트롤러를 제공하여 전문 도구에 최적화된 UX를 제공합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVSearchPanel>;

/**
 * 기본형(Basic) 예시입니다. 레이블이 상단에 위치하여 모바일 대응이나 좁은 영역에 적합합니다.
 */
export const Basic: Story = {
  args: {
    layout: 'basic',
  },
  render: (args) => (
    <NVSearchPanel {...args} onClose={() => alert('Close clicked')} />
  ),
};

/**
 * 데스크탑 최적화(Desktop) 예시입니다. 레이블과 콘텐츠가 가로로 배치되어 좌우 공간을 효율적으로 사용합니다.
 */
export const DesktopOptimized: Story = {
  args: {
    layout: 'desktop',
  },
  render: (args) => (
    <NVSearchPanel {...args} onClose={() => alert('Close clicked')} />
  ),
};

/**
 * 헤더 토글 인터랙션 예시입니다.
 */
export const ToggleExample: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(true);
    
    return (
      <div className="w-[1000px] h-[500px] flex flex-col bg-slate-950 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
        {/* Mock App Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/20" />
            <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">Nova Library</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 text-xs w-[350px] text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "absolute right-2 top-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300",
                  isOpen ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-white/10 text-slate-400 hover:bg-white/20"
                )}
              >
                상세 검색
              </button>
            </div>
          </div>
        </header>
        
        {/* Mock App Content */}
        <main className="flex-1 p-10 overflow-hidden relative">
          <div className="grid grid-cols-4 gap-8 opacity-20 filter grayscale">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-white/10 rounded-3xl border border-white/5" />
            ))}
          </div>
          
          {/* Advanced Search Overlay */}
          {isOpen && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out z-50">
              <NVSearchPanel 
                layout="desktop"
                onClose={() => setIsOpen(false)}
                onSearch={() => setIsOpen(false)}
              />
            </div>
          )}
        </main>
      </div>
    );
  }
};

/**
 * 팝업형(Popover) 예시입니다.
 * 좁은 공간에서도 모든 필터링 기능을 정교하게 사용할 수 있습니다.
 */
export const PopoverLayout: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    return (
      <div className="w-[800px] h-[500px] flex items-center justify-center bg-slate-900 rounded-3xl overflow-hidden relative border border-white/5">
        <NVPopover open={isOpen} onOpenChange={setIsOpen}>
          <NVPopoverTrigger asChild>
            <NVButton variant={isOpen ? "glass-primary" : "glass"} className="gap-2">
              <Settings2 size={16} />
              보기 옵션 설정
            </NVButton>
          </NVPopoverTrigger>
          <NVPopoverContent className="p-0 border-none bg-transparent shadow-none w-auto overflow-visible">
            <NVSearchPanel 
              layout="basic"
              onClose={() => setIsOpen(false)}
              onSearch={() => setIsOpen(false)}
            />
          </NVPopoverContent>
        </NVPopover>
      </div>
    );
  }
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
