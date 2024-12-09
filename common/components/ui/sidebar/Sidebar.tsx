import React, { useEffect, useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useFullScreenLoading, useSidebar } from '../../../../context/ui'
import { useAuth } from '../../../../context/auth'
import { imprimir } from '../../../utils/imprimir'
import { CustomDrawer, SidebarModuloType } from './CustomDrawer'
import { MODULOS_ADMIN } from '../../../../config'

const drawerWidth = 220

export const Sidebar = () => {
  const { sideMenuOpen, closeSideMenu, openSideMenu, checkContentBadge } =
    useSidebar()

  const { usuario, estaAutenticado, progresoLogin } = useAuth()

  const [modulos, setModulos] = useState<SidebarModuloType[]>([])

  const theme = useTheme()
  const router = useRouter()

  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const md = useMediaQuery(theme.breakpoints.only('md'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { estadoFullScreen } = useFullScreenLoading()

  const interpretarModulos = () => {
    setModulos(
      MODULOS_ADMIN.map((modulo: any) => ({
        ...modulo,
        open: true,
      })) ?? []
    )
  }

  const navigateTo = async (url: string) => {
    if (sm || xs || md) {
      closeSideMenu()
    }
    await router.push(url)
  }

  useEffect(() => {
    if (sm || xs || md) {
      closeSideMenu()
    } else {
      openSideMenu()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sm, xs, md])

  useEffect(() => {
    imprimir(`reinterpretando módulos`)
    interpretarModulos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  return (
    <CustomDrawer
      variant={sm || xs || md ? 'temporary' : 'persistent'}
      open={
        sideMenuOpen &&
        estaAutenticado &&
        modulos.length > 0 &&
        !progresoLogin &&
        !estadoFullScreen &&
        modulos.some((moduloGrupo) =>
          moduloGrupo.subModulo.some((modulo) =>
            router.pathname.includes(modulo.url, 0)
          )
        )
      }
      onClose={closeSideMenu}
      sx={{
        width: sideMenuOpen ? drawerWidth : `0`,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          // borderWidth: 0.0,
          boxSizing: 'border-box',
        },
        transition: 'all 0.2s ease-out',
      }}
      rutaActual={router.pathname}
      modulos={modulos}
      setModulos={setModulos}
      navigateTo={navigateTo}
      badgeVariant="primary"
      checkContentBadge={checkContentBadge}
    />
  )
}
