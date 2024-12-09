import { createTheme } from '@mui/material'
import { Open_Sans } from 'next/font/google'
import { alpha } from '@mui/material/styles'

const OpenSansFont = Open_Sans({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FAFAFA',
      paper: '#Fff',
    },
    primary: {
      main: '#F06200',
    },
    secondary: {
      main: '#FAB301',
    },
    error: {
      main: '#BA1B1B',
    },
    action: {
      active: '#757575',
    },
    text: {
      primary: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: OpenSansFont.style.fontFamily,
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        variant: 'outlined',
      },
      styleOverrides: {
        colorPrimary: {
          borderTop: 0,
          borderLeft: 0,
          borderRight: 0,
          backgroundColor: alpha('#FFF', 0.4),
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: '600',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: '600',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFF',
          // borderWidth: 0.0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: '#454F5B',
          borderRadius: '10px',
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 3,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'dense',
        size: 'small',
      },
    },
    MuiDialog: {
      defaultProps: {
        PaperProps: {
          sx: {
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha('#FFF', 0.9),
          backdropFilter: 'blur(12px)',
        },
      },
      defaultProps: {
        elevation: 3,
      },
    },
    MuiIcon: {
      styleOverrides: {
        colorAction: {
          color: '#454F5B',
        },
        fontSizeInherit: () => ({
          fontSize: 'inherit !important',
        }),
        fontSizeSmall: ({ theme }) => ({
          fontSize: `${theme.typography.pxToRem(20)} !important`,
        }),
        fontSizeLarge: ({ theme }) => ({
          fontSize: `${theme.typography.pxToRem(36)} !important`,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    // Agregado Override para Mui Switch
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 28,
          height: 16,
          padding: 0,
          margin: 8,
          '&:active': {
            '& .MuiSwitch-thumb': {
              width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
              transform: 'translateX(9px)',
            },
          },
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(12px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: 'width 200',
          },
          '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
          },
        },
      },
    },
  },
})
