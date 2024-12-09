import { AppBar, DialogContent, Grid, Toolbar, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { CustomDialog } from '../modales/CustomDialog'
import React, { useState } from 'react'
import ThemeSwitcherButton from '../botones/ThemeSwitcherButton'
import { IconoTooltip } from '../botones/IconoTooltip'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const NavbarLogin = () => {
  const [modalAyuda, setModalAyuda] = useState(false)
  const router = useRouter()
  const abrirModalAyuda = () => {
    setModalAyuda(true)
  }
  const cerrarModalAyuda = () => {
    setModalAyuda(false)
  }

  return (
    <>
      <CustomDialog
        isOpen={modalAyuda}
        handleClose={cerrarModalAyuda}
        title={'Información'}
      >
        <DialogContent>
          <Typography variant={'body2'}>
            Agente conversacional de UBP
          </Typography>
        </DialogContent>
      </CustomDialog>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar>
        <Box display={'inline-flex'}>
              <Grid
                container
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'flex-start'}
                onClick={async () => {
                  await router.replace({
                    pathname: 'https://ubp.com.bo/',
                  })
                }}
                sx={{ cursor: 'pointer' }}
              >
                <Image
                  src={`/logo2_ubp.png`}
                  alt={''}
                  width="110"
                  height="80"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius:'25px'
                  }}
                />
                <Box sx={{ px: 0.5 }} />
                <Typography
                  color={'text.primary'}
                  component="div"
                  sx={{ fontWeight: '700' }}
                >
                  URBAN BUSINESS PLUS
                </Typography>
              </Grid>
            </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconoTooltip
            id={'ayudaLogin'}
            name={'Ayuda'}
            titulo={'Ayuda'}
            color={'action'}
            accion={() => {
              abrirModalAyuda()
            }}
            icono={'help_outline'}
          />
          <ThemeSwitcherButton />
        </Toolbar>  
        
      </AppBar>
    </>
  )
}
