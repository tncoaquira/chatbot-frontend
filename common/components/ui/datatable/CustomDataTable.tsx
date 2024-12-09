import { ReactNode } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { CriterioOrdenType } from './ordenTypes'
import {
  CollapsibleObjecto,
  ContenidoFilaType,
  CustomDesktopDataTable,
} from './CustomDesktopDataTable'
import { CustomMobileTableMobile } from './CustomMobileTableMobile'

export interface CustomDataTableType {
  titulo?: string
  descripcion?: string
  tituloPersonalizado?: ReactNode
  cabeceraPersonalizada?: ReactNode
  error?: boolean
  cargando?: boolean
  acciones?: Array<ReactNode>
  cambioOrdenCriterios?: (nuevosCriterios: Array<CriterioOrdenType>) => void
  columnas: Array<CriterioOrdenType>
  filtros?: ReactNode
  contenidoTabla: Array<ContenidoFilaType>
  paginacion?: ReactNode
  seleccionable?: boolean
  seleccionados?: (indices: Array<number>) => void
  collapsibleObjecto?: CollapsibleObjecto
}

export const CustomDataTable = ({
  titulo,
  descripcion,
  tituloPersonalizado,
  cabeceraPersonalizada,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
  cambioOrdenCriterios,
  filtros,
  contenidoTabla,
  paginacion,
  seleccionable,
  seleccionados,
  collapsibleObjecto,
}: CustomDataTableType) => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  return sm || xs
    ? CustomMobileTableMobile({
        titulo,
        descripcion,
        tituloPersonalizado,
        cabeceraPersonalizada,
        error,
        cargando,
        acciones,
        columnas,
        cambioOrdenCriterios,
        filtros,
        contenidoTabla,
        paginacion,
        seleccionable,
        seleccionados,
      })
    : CustomDesktopDataTable({
        titulo,
        descripcion,
        tituloPersonalizado,
        cabeceraPersonalizada,
        error,
        cargando,
        acciones,
        columnas,
        cambioOrdenCriterios,
        filtros,
        contenidoTabla,
        paginacion,
        seleccionable,
        seleccionados,
        collapsibleObjecto,
      })
}
