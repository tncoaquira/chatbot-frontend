import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { AlertDialog, Icono } from '../../../../common/components/ui'
import ProgresoLineal from '../../../../common/components/ui/progreso/ProgresoLineal'

export interface SincronizacionDataType {
  titulo: string
  icon: string
  descripcion?: string
  fecha: string
  sincronizacionPeticion: () => Promise<void>
  loading?: boolean
}

export const SincronizacionData = ({
  titulo,
  icon,
  descripcion,
  fecha = '09/12/2024',
  sincronizacionPeticion,
  loading = false,
}: SincronizacionDataType) => {
  const [mostrarAlertaEstadoDocumento, setMostrarAlertaEstadoDocumento] =
    useState(false)

  const sincronizar = () => {
    sincronizacionPeticion().finally(() => {
      setMostrarAlertaEstadoDocumento(false)
    })
  }
  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaEstadoDocumento}
        titulo={'Alerta'}
        texto={`¿Está a punto de  ${titulo}, ¿esta seguro?. Esto operacion puede tomar varios minutos`}
      >
        <Box height={'10px'} />
        <ProgresoLineal mostrar={loading} />
        <Box height={'5px'} />
        <Button
          variant={'outlined'}
          onClick={() => {
            setMostrarAlertaEstadoDocumento(false)
          }}
          disabled={loading}  
        >
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={sincronizar} disabled={loading}>
          Aceptar
        </Button>
      </AlertDialog>
      <CardActionArea
        sx={{
          borderRadius: 3,
        }}
        onClick={() => {
          setMostrarAlertaEstadoDocumento(true)
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Grid container direction="row">
              <Icono color={'primary'}>{icon}</Icono>
              <Box height={'30px'} width={'10px'} />
              <Typography
                variant="caption"
                sx={{ fontSize: 14, fontWeight: '600' }}
              >
                {titulo}
              </Typography>
            </Grid>
            {descripcion && (
              <Typography variant="body2" sx={{ fontSize: 14 }}>
                {descripcion}
              </Typography>
            )}
            <Chip
              key="sincronizar-web"
              label={`Ultima fecha de sincronizacion: ${fecha}`}
            />
          </CardContent>
        </Card>
      </CardActionArea>
    </>
  )
}
