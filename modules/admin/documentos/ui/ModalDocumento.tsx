import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { delay, InterpreteMensajes } from '../../../../common/utils'
import { Constantes } from '../../../../config'

import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputText } from '../../../../common/components/ui/form'
import ProgresoLineal from '../../../../common/components/ui/progreso/ProgresoLineal'
import { useAlerts, useSession } from '../../../../common/hooks'
import { imprimir } from '../../../../common/utils/imprimir'
import {
  CrearEditarDocumentoCRUDType,
  DocumentoCRUDType,
} from '../types/documentoCrudTypes'

export interface ModalDocumentoType {
  documento?: DocumentoCRUDType | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalDocumento = ({
  documento,
  accionCorrecta,
  accionCancelar,
}: ModalDocumentoType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarDocumentoCRUDType>({
    defaultValues: {
      id: documento?.id,
      titulo: documento?.titulo,
      contenido: documento?.contenido,
      link: documento?.link,
      metadata_documento: documento?.metadata_documento,
      palabrasClave: documento?.palabrasClave,
      topics: documento?.topics,
    },
  })

  const guardarActualizarDocumento = async (
    data: CrearEditarDocumentoCRUDType
  ) => {
    await guardarActualizarDocumentoPeticion(data)
  }

  const guardarActualizarDocumentoPeticion = async (
    documento: CrearEditarDocumentoCRUDType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/documentos${
          documento.id ? `/${documento.id}` : ''
        }`,
        method: !!documento.id ? 'patch' : 'post',
        body: documento,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar documento`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarDocumento)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'titulo'}
                control={control}
                name="titulo"
                label="titulo"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'link'}
                control={control}
                name="link"
                label="link"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'metadata_documento'}
                control={control}
                name="metadata_documento"
                label="Otras caracteristicas"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'palabrasClave'}
                control={control}
                name="palabrasClave"
                label="palabrasClave"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'topics'}
                control={control}
                name="topics"
                label="topics"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'contenido'}
                control={control}
                name="contenido"
                label="contenido"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
                rows={5}
                multiline={true}
              />
            </Grid>
          </Grid>
          <Box height={'10px'} />
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