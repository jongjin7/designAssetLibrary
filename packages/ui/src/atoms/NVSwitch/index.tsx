import React from 'react';

interface NVSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const NVSwitch: React.FC<NVSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const sizes = {
    sm: {
      track: 'w-7 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-3',
    },
    md: {
      track: 'w-10 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-4',
    }
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none
        ${currentSize.track}
        ${checked ? 'bg-[#6366F1]' : 'bg-[#3e3e3e]'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${currentSize.thumb}
          ${checked ? currentSize.translate : 'translate-x-0'}
        `}
      />
    </button>
  );
};
