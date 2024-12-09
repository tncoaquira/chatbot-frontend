import type { NextPage } from 'next'
import { LayoutLogin } from '../../common/components/layouts'
import Grid from '@mui/material/Grid'
import { Box, Divider, useMediaQuery, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { delay, InterpreteMensajes, siteName } from '../../common/utils'
import { Constantes } from '../../config'
import { Servicios } from '../../common/services'
import { useFullScreenLoading } from '../../context/ui'
import { useEffect } from 'react'
import { useAlerts } from '../../common/hooks'
import { imprimir } from '../../common/utils/imprimir'
import LoginContainer from '../../modules/login/ui/LoginContainer'
import Image from 'next/image'
import { Icono } from '../../common/components/ui'

const Index: NextPage = () => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  return (
    <LayoutLogin title={siteName()}>
      <Grid container alignItems={'center'}>
        <Grid item xl={6} md={6} xs={12}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            minHeight={sm || xs ? '30vh' : '80vh'}
            color={'primary'}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Image
                src={`/logoubp.png`}
                alt={'logo'}
                width="100"
                height="100"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  // border: '1px solid #a9a8a8',
                  borderRadius: 20,
                }}
              />
              <Box height="20px" />
              <Typography
                variant={'h4'}
                component="h1"
                fontWeight={'500'}
                align={sm || xs ? 'center' : 'left'}
              >
                Sistema de administracion{' '}
                <Icono fontSize="large">smart_toy</Icono>
              </Typography>
              <Typography
                variant={'subtitle1'}
                align={sm || xs ? 'center' : 'left'}
                color={'gray'}
              >
                Actualizar, configura y sincroniza la base de conocimiento del
                agente conversacional de la empresa
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xl={6} md={6} xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">

            <LoginContainer />
          </Box>
        </Grid>
      </Grid>
    </LayoutLogin>
  )
}

export default Index
