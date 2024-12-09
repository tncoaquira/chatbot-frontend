import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { delay, InterpreteMensajes } from '../../../../common/utils'
import { Constantes } from '../../../../config'

import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputText } from '../../../../common/components/ui/form'
import ProgresoLineal from '../../../../common/components/ui/progreso/ProgresoLineal'
import { useAlerts, useSession } from '../../../../common/hooks'
import { imprimir } from '../../../../common/utils/imprimir'
import { CrearEditarPreguntaCRUDType } from '../types/preguntaCrudTypes'

export interface ModalpreguntaType {
  idDocumento: number
  pregunta?: CrearEditarPreguntaCRUDType | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalPregunta = ({
  idDocumento,
  pregunta,
  accionCorrecta,
  accionCancelar,
}: ModalpreguntaType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarPreguntaCRUDType>({
    defaultValues: {
      id: pregunta?.id,
      textoPregunta: pregunta?.textoPregunta,
      idDocumento: idDocumento,
    },
  })

  const guardarActualizarpregunta = async (
    data: CrearEditarPreguntaCRUDType
  ) => {
    await guardarActualizarpreguntaPeticion(data)
  }

  const guardarActualizarpreguntaPeticion = async (
    pregunta: CrearEditarPreguntaCRUDType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/preguntas${
          pregunta.id ? `/${pregunta.id}` : ''
        }`,
        method: !!pregunta.id ? 'patch' : 'post',
        body: pregunta,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar pregunta`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarpregunta)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'textoPregunta'}
                control={control}
                name="textoPregunta"
                label="Definicion de la pregunta"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <ProgresoLineal mostrar={loadingModal} />
          <Box height={'5px'} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
