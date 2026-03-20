import type { Preview } from '@storybook/react';
import '../src/styles/theme.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0B0E14',
        },
      ],
    },
    options: {
      storySort: {
        order: ['Foundations', ['ColorPalette', 'TypographyGuide'], 'Atoms', 'Molecules', 'Organisms'],
      },
    },
  },
};

export default preview;
