import type { Meta, StoryObj } from '@storybook/react';
import { NVButton } from './index';
import { NVCard } from '../NVCard';
import { LogOut, Download, Plus, Zap, Heart } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof NVButton> = {
  title: 'Atoms/Button',
  component: NVButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '다양한 테마와 크기를 지원하는 범용 버튼 컴포넌트입니다. 일반 상태부터 글래스(Glass) 효과까지 디자인 시스템 전반에서 사용됩니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'vivid', 'danger', 'ghost', 'glass', 'glass-primary', 'glass-neutral', 'glass-danger'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVButton>;

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본 액션에 사용되는 가장 강조된 버튼입니다.',
      },
    },
  },
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  parameters: {
    docs: {
      description: {
        story: '보조 액션에 사용되는 버튼입니다.',
      },
    },
  },
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Vivid: Story = {
  parameters: {
    docs: {
      description: {
        story: 'AI 기능이나 특별한 강조가 필요한 액션에 사용되는 채도 높은 사이언 버튼입니다.',
      },
    },
  },
  args: {
    variant: 'vivid',
    children: 'Vivid Cyan',
  },
};

export const Danger: Story = {
  parameters: {
    docs: {
      description: {
        story: '삭제, 로그아웃 등 주의가 필요한 파괴적인 액션에 사용됩니다.',
      },
    },
  },
  args: {
    variant: 'danger',
    children: (
      <>
        <LogOut size={18} className="mr-2" />
        Logout
      </>
    ),
  },
};

export const Ghost: Story = {
  parameters: {
    docs: {
      description: {
        story: '배경 없이 텍스트만 강조되는 버튼으로, 낮은 명시성을 가집니다.',
      },
    },
  },
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Glass: Story = {
  parameters: {
    docs: {
      description: {
        story: '유리판 배경 위에서 자연스럽게 어우러지는 글래스 효과의 기본 버튼입니다.',
      },
    },
  },
  args: {
    variant: 'glass',
    children: 'Standard Glass',
  },
};

export const GlassPrimary: Story = {
  args: {
    variant: 'glass-primary',
    children: 'Glass Primary',
  },
};

export const GlassNeutral: Story = {
  args: {
    variant: 'glass-neutral',
    children: 'Glass Neutral',
  },
};

export const GlassDanger: Story = {
  args: {
    variant: 'glass-danger',
    children: 'Glass Danger',
  },
};

export const OnGlassShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story: '다양한 유리판(NVCard) 테마 위에서의 버튼 가독성을 확인하기 위한 쇼케이스입니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10 p-10 bg-slate-950 rounded-3xl">
      {/* Dark Theme Panel */}
      <NVCard theme="dark" hoverEffect={false}>
        <h4 className="font-bold mb-4">Dark Theme Panel</h4>
        <div className="flex gap-4">
          <NVButton variant="glass-primary" size="sm">Primary</NVButton>
          <NVButton variant="glass-neutral" size="sm">Neutral</NVButton>
          <NVButton variant="glass-danger" size="sm">Danger</NVButton>
        </div>
      </NVCard>

      {/* Light Theme Panel */}
      <NVCard theme="light" hoverEffect={false}>
        <h4 className="font-bold mb-4">Light Theme Panel</h4>
        <div className="flex gap-4">
          <NVButton variant="glass-primary" size="sm">Primary</NVButton>
          <NVButton variant="glass-neutral" size="sm">Neutral</NVButton>
          <NVButton variant="glass-danger" size="sm">Danger</NVButton>
        </div>
      </NVCard>
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: '아이콘과 함께 사용하는 예시입니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <NVButton variant="primary">
        <Plus size={18} className="mr-2" />
        Add Item
      </NVButton>
      <NVButton variant="vivid">
        <Zap size={18} className="mr-2" />
        AI Feature
      </NVButton>
      <NVButton variant="glass-neutral">
        <Heart size={18} className="mr-2" />
        Save
      </NVButton>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'xs부터 lg까지 버튼의 4가지 크기를 비교합니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 items-end">
      <NVButton size="xs" variant="primary">X-Small</NVButton>
      <NVButton size="sm" variant="primary">Small</NVButton>
      <NVButton size="md" variant="primary">Medium</NVButton>
      <NVButton size="lg" variant="primary">Large</NVButton>
    </div>
  ),
};
