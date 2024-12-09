import type { NextPage } from 'next'
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useAuth } from '../../context/auth'
import { LayoutUser } from '../../common/components/layouts'
import React, { useState } from 'react'
import { delay, siteName, titleCase } from '../../common/utils'
import { CustomDialog, Icono } from '../../common/components/ui'
import { CambioPassModal } from '../../modules/admin/perfil/CambioPassModal'
import { UsuarioModal } from '../../modules/admin/perfil/ui/UsuarioModal'

const Perfil: NextPage = () => {
  const { usuario, obtenerPerfil } = useAuth()
  const [usuarioModal, setUsuarioModal] = useState(false)
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const [modalAyuda, setModalAyuda] = useState(false)

  const abrirModalAyuda = () => {
    setModalAyuda(true)
  }
  const cerrarModalAyuda = () => {
    setModalAyuda(false)
  }

  const cerrarModalUsuario = async () => {
    obtenerPerfil()
    delay(200)
    setUsuarioModal(false)
  }

  return (
    <>
      <CustomDialog
        isOpen={modalAyuda}
        handleClose={cerrarModalAyuda}
        title={'Cambio de contraseña'}
      >
        <CambioPassModal
          idUser={usuario?.id ? parseInt(usuario.id) : null}
          accionCorrecta={cerrarModalAyuda}
          accionCancelar={cerrarModalAyuda}
        />
      </CustomDialog>
      <CustomDialog
        isOpen={usuarioModal}
        handleClose={() => { setUsuarioModal(false) }}
        title={'Editar informacion personal'
        }
      >
        <UsuarioModal
          user={usuario}
          accionCorrecta={cerrarModalUsuario}
          accionCancelar={() => { setUsuarioModal(false) }}
        />
      </CustomDialog>
      <LayoutUser
        title={`Perfil - ${titleCase(
          usuario?.nombres ?? ''
        )} - ${siteName()}`}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
            Perfil
          </Typography>
        </Grid>
        <Box height={'20px'} />
        <Grid container>
          <Grid item xl={6} md={6} xs={12}>
            <Box>
              <Card sx={{ borderRadius: 3 }}>
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{
                    width: '100%',
                    height: sm || xs ? '' : 370,
                    // backgroundColor: 'primary.main',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-out !important',
                    p: 2,
                  }}
                >
                  <Icono
                    sx={{ color: 'text.secondary' }}
                    style={{ fontSize: 100 }}
                  >
                    account_circle
                  </Icono>

                  <Typography variant={'body1'} color="text.secondary">
                    {
                      `Usuario: ${usuario?.usuario}`
                    }
                  </Typography>
                  <Box height={'30px'} />
                  <Button
                    size="large"
                    onClick={() => {
                      abrirModalAyuda()
                    }}
                    color="primary"
                    variant="contained"
                  >
                    <Icono color={'inherit'}>vpn_key</Icono>
                    <Box width={'10px'} />
                    <Typography
                      sx={{ fontWeight: '600' }}
                      variant={'body2'}
                    >
                      Cambiar contraseña
                    </Typography>
                  </Button>
                </Box>

              </Card>
            </Box>
          </Grid>
          <Grid
            item
            xl={6}
            md={6}
            xs={12}
            sx={{ pl: sm || xs ? 0 : 6, pr: sm || xs ? 0 : 6 }}
          >
            <Box justifyContent={'center'} alignItems={'center'}>
              <Box justifyContent={'center'} alignItems={'center'}>
                <Grid container direction={'column'}>
                  <Grid
                    container
                    justifyContent="space-between"
                    direction={'column'}
                  >
                    <Typography
                      sx={{ fontWeight: '600' }}
                      variant={'subtitle2'}
                    >
                      Usuario
                    </Typography>
                    <Typography>{`${usuario?.usuario}`}</Typography>
                  </Grid>
                  <Box height={'20px'} />
                  <Grid
                    container
                    justifyContent="space-between"
                    direction={'column'}
                  >
                    <Typography
                      sx={{ fontWeight: '600' }}
                      variant={'subtitle2'}
                    >
                      Nombres
                    </Typography>
                    <Typography>{`${usuario?.nombres}`}</Typography>
                  </Grid>
                  <Box height={'20px'} />
                  <Grid
                    container
                    justifyContent="space-between"
                    direction={'column'}
                  >
                    <Typography
                      sx={{ fontWeight: '600' }}
                      variant={'subtitle2'}
                    >
                      Apellidos
                    </Typography>
                    <Typography>{`${usuario?.apellidos}`}</Typography>
                  </Grid>
                  <Box height={'20px'} />
                  <Grid
                    container
                    justifyContent="space-between"
                    direction={'column'}
                  >
                    <Typography
                      sx={{ fontWeight: '600' }}
                      variant={'subtitle2'}
                    >
                      Número de documento
                    </Typography>
                    <Typography variant={'body1'}>
                      {`${usuario?.ci}`}
                    </Typography>
                  </Grid>
                  <Box height={'20px'} />
                  <Grid
                    container
                    justifyContent="space-between"
                    direction={'column'}
                  >
                    <Typography
                      sx={{ fontWeight: '600' }}
                      variant={'subtitle2'}
                    >
                      Correo electrónico
                    </Typography>
                    <Typography variant={'body1'}>
                      {`${usuario?.correo}`}
                    </Typography>
                  </Grid>
                  <Box height={'20px'} />
                  <Box display={'flex'}>
                    <Button
                      size="large"
                      onClick={() => { setUsuarioModal(true) }}
                      color="primary"
                      variant="contained"
                    >
                      <Icono color={'inherit'}>edit</Icono>
                      <Box width={'10px'} />
                      <Typography
                        sx={{ fontWeight: '600' }}
                        variant={'body2'}
                      >
                        Actualizar Datos
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </LayoutUser>
    </>
  )
}

export default Perfil
