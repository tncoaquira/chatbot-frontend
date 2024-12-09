import type { NextPage } from 'next'
import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useAuth } from '../../context/auth'
import { LayoutUser } from '../../common/components/layouts'
import React, { ReactNode, useEffect, useState } from 'react'
import { AlertDialog, CustomDataTable } from '../../common/components/ui'
import {
  delay,
  InterpreteMensajes,
  siteName,
  titleCase,
} from '../../common/utils'
import { Constantes, LIMITE_PAGINADO } from '../../config'

import { Paginacion } from '../../common/components/ui/datatable/Paginacion'
import { useAlerts, useSession } from '../../common/hooks'
import { imprimir } from '../../common/utils/imprimir'
import CustomMensajeEstado from '../../common/components/ui/estados/CustomMensajeEstado'
import { CriterioOrdenType } from '../../common/components/ui/datatable/ordenTypes'
import { CustomSwitch } from '../../common/components/ui/botones/CustomSwitch'
import { CustomToggleButton } from '../../common/components/ui/botones/CustomToogleButton'
import { PreguntaCRUDType } from '../../modules/admin/preguntas/types/preguntaCrudTypes'
import { FiltroPregunta } from '../../modules/admin/preguntas/ui/FiltroPregunta'
import { ContenidoFilaType } from '../../common/components/ui/datatable/CustomDesktopDataTable'

const Preguntas: NextPage = () => {
  const [preguntaData, setPreguntaData] = useState<PreguntaCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [erroPreguntaData, setErrorPreguntaData] = useState<any>()

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoPregunta, setMostrarAlertaEstadoPregunta] =
    useState(false)

  const [preguntaEdicion, serPreguntaEdicion] = useState<
    PreguntaCRUDType | undefined | null
  >()

  // Variables de páginado
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const { sesionPeticion } = useSession()
  /*   const { estaAutenticado, permisoUsuario } = useAuth() */

  const [filtroPregunta, setFiltroPregunta] = useState<string>('')
  const [mostrarFiltroPregunta, setMostrarFiltroPregunta] = useState(false)

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  /// Método que muestra alerta de cambio de estado

  const editarEstadoPreguntaModal = (pregunta: PreguntaCRUDType) => {
    serPreguntaEdicion(pregunta) // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoPregunta(true) // para mostrar alerta de pregunta
  }

  const cancelarAlertaEstadoPregunta = async () => {
    setMostrarAlertaEstadoPregunta(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    serPreguntaEdicion(null)
  }

  /// Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoPregunta = async () => {
    setMostrarAlertaEstadoPregunta(false)
    if (preguntaEdicion) {
      await cambiarEstadoDocumentoPeticion(preguntaEdicion)
    }
    serPreguntaEdicion(null)
  }

  /// Petición que cambia el estado de un parámetro
  const cambiarEstadoDocumentoPeticion = async (pregunta: PreguntaCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/preguntas/${pregunta.id}/${
          pregunta._status == 'ACTIVO' ? 'inactivar' : 'activar'
        }`,
        method: 'patch',
      })
      imprimir(`respuesta estado pregunta: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerPreguntasPeticion()
    } catch (e) {
      imprimir(`Error estado pregunta`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }
  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'textoPregunta', nombre: 'texto pregunta', ordenar: false },
    { campo: 'idDocumento', nombre: 'codigo documento', ordenar: false },
    { campo: '_status', nombre: 'estado', ordenar: false },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<ContenidoFilaType> = preguntaData.map(
    (preguntaData, indexPregunta) => ({
      idFila: preguntaData?.id || indexPregunta,
      columnasFila: [
        <Typography
          key={`${preguntaData.id}-${indexPregunta}-textoPregunta`}
          variant={'body2'}
        >{`${preguntaData.textoPregunta}`}</Typography>,
        <Typography
          key={`${preguntaData.id}-${indexPregunta}-idDocumento`}
          variant={'body2'}
        >
          {`${preguntaData.idDocumento}`}
        </Typography>,

        <CustomMensajeEstado
          key={`${preguntaData.id}-${indexPregunta}-estado`}
          titulo={preguntaData._status}
          descripcion={preguntaData._status}
          color={
            preguntaData._status == 'ACTIVO'
              ? 'success'
              : preguntaData._status == 'INACTIVO'
              ? 'error'
              : 'info'
          }
        />,
        <Stack
          key={`${preguntaData.id}-${indexPregunta}-acciones`}
          direction={'row'}
          alignItems={'center'}
        >
          <CustomSwitch
            id={`cambiar EstadoPregunta-${preguntaData.id}`}
            titulo={preguntaData._status == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            accion={async () => {
              await editarEstadoPreguntaModal(preguntaData)
            }}
            name={
              preguntaData._status == 'ACTIVO'
                ? 'Inactivar pregunta'
                : 'Activar pregunta'
            }
            color={preguntaData._status == 'ACTIVO' ? 'primary' : 'error'}
            marcado={preguntaData._status == 'ACTIVO'}
            desactivado={preguntaData._status == 'PENDIENTE'}
          />
        </Stack>,
      ],
    })
  )

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarDocumentoToggle'}
      key={'accionFiltrarDocumentoToggle'}
      icono="search"
      seleccionado={mostrarFiltroPregunta}
      cambiar={setMostrarFiltroPregunta}
    />,
  ]

  const obtenerPreguntasPeticion = async () => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/preguntas`,
        params: {
          pagina: pagina,
          ...(filtroPregunta.length == 0 ? {} : { filtro: filtroPregunta }),
        },
      })
      setPreguntaData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorPreguntaData(null)
    } catch (e) {
      imprimir(`Error al obtener preguntas`, e)
      setErrorPreguntaData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (true) obtenerPreguntasPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    /*  estaAutenticado, */
    pagina,
    filtroPregunta,
  ])

  useEffect(() => {
    if (!mostrarFiltroPregunta) {
      setFiltroPregunta('')
    }
  }, [mostrarFiltroPregunta])

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={LIMITE_PAGINADO}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={() => {}}
    />
  )

  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaEstadoPregunta}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          preguntaEdicion?._status == 'ACTIVO' ? 'inactivar' : 'activar'
        } la pregunta: ${titleCase(preguntaEdicion?.textoPregunta ?? '')} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEstadoPregunta}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEstadoPregunta}>
          Aceptar
        </Button>
      </AlertDialog>
      <LayoutUser title={`Preguntas - ${siteName()}`}>
        <CustomDataTable
          titulo={'Preguntas a resolver'}
          descripcion='Las preguntas estan asociadas a un documento, y son aquellas que pueden ser resueltas por el chatbot'
          error={!!erroPreguntaData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
          filtros={
            mostrarFiltroPregunta && (
              <FiltroPregunta
                filtroPregunta={filtroPregunta}
                accionCorrecta={(filtros) => {
                  setPagina(1)
                  setFiltroPregunta(filtros.pregunta)
                }}
                accionCerrar={() => {
                  imprimir(`👀 cerrar`)
                }}
              />
            )
          }
        />
      </LayoutUser>
    </>
  )
}
export default Preguntas
