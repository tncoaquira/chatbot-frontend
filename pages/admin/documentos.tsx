import type { NextPage } from 'next'
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useAuth } from '../../context/auth'
import { LayoutUser } from '../../common/components/layouts'
import React, { ReactNode, useEffect, useState } from 'react'
import {
  AlertDialog,
  CustomDataTable,
  CustomDialog,
  IconoTooltip,
} from '../../common/components/ui'
import {
  delay,
  InterpreteMensajes,
  siteName,
  titleCase,
} from '../../common/utils'
import { Constantes, LIMITE_PAGINADO } from '../../config'

import { Paginacion } from '../../common/components/ui/datatable/Paginacion'
import { useRouter } from 'next/router'
import { VistaModalDocumento } from '../../modules/admin/documentos/ui'
import { useAlerts, useSession } from '../../common/hooks'
import { imprimir } from '../../common/utils/imprimir'
import { DocumentoCRUDType } from '../../modules/admin/documentos/types/documentoCrudTypes'
import { FiltroDocumento } from '../../modules/admin/documentos/ui/FiltroDocumento'
import CustomMensajeEstado from '../../common/components/ui/estados/CustomMensajeEstado'
import { CriterioOrdenType } from '../../common/components/ui/datatable/ordenTypes'
import { IconoBoton } from '../../common/components/ui/botones/IconoBoton'
import { CustomSwitch } from '../../common/components/ui/botones/CustomSwitch'
import { CustomToggleButton } from '../../common/components/ui/botones/CustomToogleButton'
import { ContenidoFilaType } from '../../common/components/ui/datatable/CustomDesktopDataTable'
import { ListaPreguntasDocumento } from '../../modules/admin/preguntas/ui/ListaPreguntasDocumento'
import { SincronizacionData } from '../../modules/admin/documentos/ui/SincronizacionData'
import { useFetchSincronizacionDB } from '../../modules/admin/documentos/hooks/useFetchSincronizacionDB'

const Documento: NextPage = () => {
  const [documentosData, setDocumentosData] = useState<DocumentoCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [errorDocumentosData, setErrorDocumentosData] = useState<any>()

  const [modalDocumento, setModalDocumento] = useState(false)

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoDocumento, setMostrarAlertaEstadoDocumento] =
    useState(false)

  const [documentoEdicion, setDocumentoEdicion] = useState<
    DocumentoCRUDType | undefined | null
  >()

  // Variables de páginado
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const { sesionPeticion } = useSession()
  /*   const { estaAutenticado, permisoUsuario } = useAuth() */

  const [filtroDocumento, setFiltroDocumento] = useState<string>('')
  const [mostrarFiltroDocumento, setMostrarFiltroDocumento] = useState(false)

  const { sincronacionDBLoading, sincronizarDBPeticion } =
    useFetchSincronizacionDB()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  /// Método que muestra alerta de cambio de estado

  const editarEstadoDocumentoModal = (documento: DocumentoCRUDType) => {
    setDocumentoEdicion(documento) // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoDocumento(true) // para mostrar alerta de documento
  }

  const cancelarAlertaEstadoDocumento = async () => {
    setMostrarAlertaEstadoDocumento(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setDocumentoEdicion(null)
  }

  /// Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoDocumento = async () => {
    setMostrarAlertaEstadoDocumento(false)
    if (documentoEdicion) {
      await cambiarEstadoDocumentoPeticion(documentoEdicion)
    }
    setDocumentoEdicion(null)
  }

  /// Petición que cambia el estado de un parámetro
  const cambiarEstadoDocumentoPeticion = async (
    documento: DocumentoCRUDType
  ) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/documentos/${documento.id}/${
          documento._status == 'ACTIVO' ? 'inactivar' : 'activar'
        }`,
        method: 'patch',
      })
      imprimir(`respuesta estado documento: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerDocumentosPeticion()
    } catch (e) {
      imprimir(`Error estado documento`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // router para conocer la ruta actual
  const router = useRouter()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'codigo', nombre: 'codigo', ordenar: false },
    { campo: 'titulo', nombre: 'titulo', ordenar: false },
    { campo: 'contenido', nombre: 'contenido', ordenar: false },
    { campo: 'link', nombre: 'link', ordenar: false },
    {
      campo: 'metadata_documento',
      nombre: 'metadata_documento',
      ordenar: false,
    },
    { campo: 'palabrasClave', nombre: 'palabrasClave', ordenar: false },
    { campo: 'topics', nombre: 'topics', ordenar: false },
    { campo: '_status', nombre: '_status', ordenar: false },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<ContenidoFilaType> = documentosData.map(
    (documentosData, indexDocumento) => ({
      idFila: documentosData.id,
      columnasFila: [
        <Typography
          key={`${documentosData.id}-${indexDocumento}-codigo`}
          variant={'body2'}
        >{`${documentosData.id}`}</Typography>,
        <Typography
          key={`${documentosData.id}-${indexDocumento}-titulo`}
          variant={'body2'}
        >{`${documentosData.titulo}`}</Typography>,
        <Typography
          key={`${documentosData.id}-${indexDocumento}-contenido`}
          variant={'body2'}
        >
          {`${documentosData.contenido}`}
        </Typography>,
        <Typography
          key={`${documentosData.id}-${indexDocumento}-link`}
          variant={'body2'}
        >{`${documentosData.link}`}</Typography>,
        <Typography
          key={`${documentosData.id}-${indexDocumento}-metadata_documento`}
          variant={'body2'}
        >{`${documentosData.metadata_documento}`}</Typography>,
        <Typography
          key={`${documentosData.id}-${indexDocumento}-palabrasClave`}
          variant={'body2'}
        >{`${documentosData.palabrasClave}`}</Typography>,
        <Typography
          key={`${documentosData.id}-${indexDocumento}-topics`}
          variant={'body2'}
        >{`${documentosData.topics}`}</Typography>,

        <CustomMensajeEstado
          key={`${documentosData.id}-${indexDocumento}-estado`}
          titulo={documentosData._status}
          descripcion={documentosData._status}
          color={
            documentosData._status == 'ACTIVO'
              ? 'success'
              : documentosData._status == 'INACTIVO'
                ? 'error'
                : 'info'
          }
        />,
        <Stack
          key={`${documentosData.id}-${indexDocumento}-acciones`}
          direction={'row'}
          alignItems={'center'}
        >
          <CustomSwitch
            id={`cambiarEstadoDocumento-${documentosData.id}`}
            titulo={
              documentosData._status == 'ACTIVO' ? 'Inactivar' : 'Activar'
            }
            accion={async () => {
              await editarEstadoDocumentoModal(documentosData)
            }}
            name={
              documentosData._status == 'ACTIVO'
                ? 'Inactivar Parámetro'
                : 'Activar Parámetro'
            }
            color={documentosData._status == 'ACTIVO' ? 'primary' : 'error'}
            marcado={documentosData._status == 'ACTIVO'}
            desactivado={documentosData._status == 'PENDIENTE'}
          />
          <IconoTooltip
            id={`editarDocumento-${documentosData.id}`}
            name={'Documento'}
            titulo={'Editar'}
            color={'primary'}
            icono={'edit'}
            accion={async () => {
              await editartDocumentoModal(documentosData)
            }}
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
      seleccionado={mostrarFiltroDocumento}
      cambiar={setMostrarFiltroDocumento}
    />,
    <IconoTooltip
      id={'actualizarDocumento'}
      titulo={'Actualizar'}
      key={`accionActualizarParametro`}
      accion={async () => {
        await obtenerDocumentosPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de parámetros'}
    />,
    <IconoBoton
      id={'agregarDocumento'}
      key={'agregarDocumento'}
      texto={'Agregar'}
      variante={xs ? 'icono' : 'boton'}
      icono={'add_circle_outline'}
      descripcion={'Agregar parámetro'}
      accion={() => {
        agregarDocumento()
      }}
    />,
  ]

  const obtenerDocumentosPeticion = async () => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/documentos`,
        params: {
          pagina: pagina,
          ...(filtroDocumento.length == 0 ? {} : { filtro: filtroDocumento }),
        },
      })
      setDocumentosData(respuesta.datos?.filas)
      setTotal(respuesta.datos?.total)
      setErrorDocumentosData(null)
    } catch (e) {
      imprimir(`Error al obtener documentos`, e)
      setErrorDocumentosData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarDocumento = () => {
    setDocumentoEdicion(undefined)
    setModalDocumento(true)
  }
  const editartDocumentoModal = (documento: DocumentoCRUDType) => {
    setDocumentoEdicion(documento)
    setModalDocumento(true)
  }

  const cerrarModalParametro = async () => {
    setModalDocumento(false)
    await delay(500)
    setDocumentoEdicion(undefined)
  }

  useEffect(() => {
    if (true) obtenerDocumentosPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    /*  estaAutenticado, */
    pagina,
    filtroDocumento,
  ])

  useEffect(() => {
    if (!mostrarFiltroDocumento) {
      setFiltroDocumento('')
    }
  }, [mostrarFiltroDocumento])

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
        isOpen={mostrarAlertaEstadoDocumento}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          documentoEdicion?._status == 'ACTIVO' ? 'inactivar' : 'activar'
        } el parámetro: ${titleCase(documentoEdicion?.titulo ?? '')} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEstadoDocumento}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEstadoDocumento}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalDocumento}
        handleClose={cerrarModalParametro}
        title={
          documentoEdicion
            ? 'Editar documento de informacion'
            : 'Nuevo documento de informacion'
        }
      >
        <VistaModalDocumento
          documento={documentoEdicion}
          accionCorrecta={() => {
            cerrarModalParametro().finally()
            obtenerDocumentosPeticion().finally()
          }}
          accionCancelar={cerrarModalParametro}
        />
      </CustomDialog>
      <LayoutUser title={`Documento - ${siteName()}`}>
        <Grid
          container
          direction="row"
          flex="flex"
          justifyContent={'end'}
          mb={1}
        >
          <Grid item xs={8} sm={4} md={4} key={`$subModulo-${1}`}>
            <SincronizacionData
              titulo="Sincrononizar con la base de datos"
              icon="table_rows"
              fecha="09/12/2024"
              sincronizacionPeticion={sincronizarDBPeticion}
              loading={sincronacionDBLoading}
            />
          </Grid>
        </Grid>
        <CustomDataTable
          titulo={'Documentos de información'}
          descripcion="Los documentos son la informacion que se brinda al chatbot para responder determinada pregunta asociada."
          error={!!errorDocumentosData}
          cargando={loading}
          acciones={acciones}
          columnas={ordenCriterios}
          cambioOrdenCriterios={setOrdenCriterios}
          paginacion={paginacion}
          contenidoTabla={contenidoTabla}
          filtros={
            mostrarFiltroDocumento && (
              <FiltroDocumento
                filtroDocumento={filtroDocumento}
                accionCorrecta={(filtros) => {
                  setPagina(1)
                  setFiltroDocumento(filtros.documento)
                }}
                accionCerrar={() => {
                  imprimir(`👀 cerrar`)
                }}
              />
            )
          }
          collapsibleObjecto={{
            obteto: (idFila) => (
              <Box margin={2}>
                <ListaPreguntasDocumento idDocumento={idFila} />
              </Box>
            ),
            nroColumnas: 4,
          }}
        />
      </LayoutUser>
    </>
  )
}
export default Documento
