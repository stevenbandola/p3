import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'gray',
  fontFamily: 'Inter, sans-serif',

  shadows: {
    xs: '0px 4px 8px rgba(0, 0, 0, 0.04)',
    sm: '0px 8px 16px rgba(0, 0, 0, 0.08)',
    md: '0px 12px 24px rgba(0, 0, 0, 0.12)',
    lg: '0px 16px 32px rgba(0, 0, 0, 0.16)',
    xl: '0px 24px 48px rgba(0, 0, 0, 0.24)',
  },
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: {
        fontSize: '36px',
        lineHeight: '44px',
      },
      h2: {
        fontSize: '24px',
        lineHeight: '32px',
      },
      h3: {
        fontSize: '20px',
        lineHeight: '28px',
      },
      h4: {
        fontSize: '18px',
        lineHeight: '26px',
      },
      h5: {
        fontSize: '16px',
        lineHeight: '24px',
      },
      h6: {
        fontSize: '14px',
        lineHeight: '22px',
      },
    },
  },
})
