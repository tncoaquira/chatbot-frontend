import { Box, Grid } from '@mui/material'
import { FormInputText } from '../../../../common/components/ui/form'
import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect } from 'react'

export interface FiltroType {
  documento: string
}

export interface FiltroDocumentoType {
  filtroDocumento: string
  accionCorrecta: (filtros: FiltroType) => void
  accionCerrar: () => void
}

export const FiltroDocumento = ({
  filtroDocumento,
  accionCorrecta,
}: FiltroDocumentoType) => {
  const { control, watch } = useForm<FiltroType>({
    defaultValues: {
      documento: filtroDocumento,
    },
  })

  const parametroFiltro: string | undefined = watch('documento')

  useEffect(() => {
    actualizacionFiltros({
      documento: parametroFiltro,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametroFiltro])

  const debounced = useDebouncedCallback((filtros: FiltroType) => {
    accionCorrecta(filtros)
  }, 1000)

  const actualizacionFiltros = (filtros: FiltroType) => {
    debounced(filtros)
  }

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <FormInputText
            id={'documento'}
            name={'documento'}
            control={control}
            label={'Buscar documento'}
            bgcolor={'background.paper'}
             borderRadius="10px"
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  )
}
