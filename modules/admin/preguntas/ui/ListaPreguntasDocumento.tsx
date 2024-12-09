import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { IconoBoton } from '../../../../common/components/ui/botones/IconoBoton'
import {
  CustomDialog,
  Icono,
  IconoTooltip,
} from '../../../../common/components/ui'
import {
  PreguntaCRUDType,
} from '../types/preguntaCrudTypes'
import { useAlerts, useSession } from '../../../../common/hooks'
import { useEffect, useState } from 'react'
import { imprimir } from '../../../../common/utils/imprimir'
import { InterpreteMensajes, delay } from '../../../../common/utils'
import { Constantes } from '../../../../config'
import { VistaModalPregunta } from './VistaModalPregunta'

export interface ListaPreguntasDocumentoType {
  idDocumento: number
}

export const ListaPreguntasDocumento = ({
  idDocumento,
}: ListaPreguntasDocumentoType) => {
  const [preguntasData, setPreguntasData] = useState<PreguntaCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [preguntaEdicion, setPreguntaEdicion] = useState<
    PreguntaCRUDType | undefined | null
  >()
  const [modalPregunta, setModalPregunta] = useState(false)
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()

  const agregarPreguntaModal = () => {
    setPreguntaEdicion(undefined)
    setModalPregunta(true)
  }
  const editarPreguntaModal = (pregunta: PreguntaCRUDType) => {
    setPreguntaEdicion(pregunta)
    setModalPregunta(true)
  }
  const cerrarModalPregunta = async () => {
    setModalPregunta(false)
    await delay(500)
    setPreguntaEdicion(undefined)
  }

  const obtenerPreguntasPeticion = async () => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/documentos/${idDocumento}/preguntas`,
      })
      setPreguntasData(respuesta.datos?.filas)
    } catch (e) {
      imprimir(`Error al obtener preguntas`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoPreguntaPeticion = async (idPregunta: number) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/preguntas/${idPregunta}/inactivar`,
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

  useEffect(() => {
    if (true) obtenerPreguntasPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <CustomDialog
        isOpen={modalPregunta}
        handleClose={cerrarModalPregunta}
        title={
          preguntaEdicion
            ? 'Editar pregunta de informacion'
            : 'Nuevo pregunta de informacion'
        }
      >
        <VistaModalPregunta
          idDocumento={idDocumento}
          pregunta={preguntaEdicion}
          accionCorrecta={() => {
            cerrarModalPregunta().finally()
            obtenerPreguntasPeticion().finally()
          }}
          accionCancelar={cerrarModalPregunta}
        />
      </CustomDialog>
      <List sx={{ p: 2 }} component={Paper} variant="outlined">
        <Typography sx={{ fontSize: 16, fontWeight: 600 }} variant="subtitle2">
          Preguntas asociadas
          <IconoBoton
            id={'agregarPregunta'}
            key={'agregarPregunta'}
            texto={'Agregar'}
            variante={'icono'}
            icono={'add'}
            descripcion={'Agregar Pregunta'}
            accion={() => {
              agregarPreguntaModal()
            }}
          />
        </Typography>
        <Box height={'20px'} />
        {preguntasData.length > 0 ? (
          preguntasData.map((pregunta, index) => (
            <ListItem
              key={`preguntas${index}`}
              secondaryAction={
                <>
                  <IconoBoton
                    id={'quitarPregunta'}
                    key={'quitarPregunta'}
                    texto={'Quitar'}
                    variante={'icono'}
                    icono={'do_not_disturb_on'}
                    descripcion={'Quitar Pregunta'}
                    accion={() => {
                      cambiarEstadoPreguntaPeticion(pregunta.id)
                    }}
                  />
                  <IconoTooltip
                    id={`editarDocumento-${pregunta.id}`}
                    name={'Documento'}
                    titulo={'Editar'}
                    color={'primary'}
                    icono={'edit'}
                    accion={async () => {
                      await editarPreguntaModal(pregunta)
                    }}
                  />
                </>
              }
            >
              <ListItemAvatar>
                <Icono fontSize="small" color="secondary">
                  question_mark
                </Icono>
              </ListItemAvatar>
              <ListItemText primary={pregunta.textoPregunta} />
            </ListItem>
          ))
        ) : (
          <Typography
            variant="caption"
            color={'gray'}
            sx={{
              fontSize: 14,
              m: 2,
              ml: 5,
              mr: 5,
            }}
          >
            No hay preguntas asociadas
          </Typography>
        )}
      </List>
    </>
  )
}
