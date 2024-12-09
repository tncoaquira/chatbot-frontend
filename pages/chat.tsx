import type { NextPage } from 'next'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { InterpreteMensajes, siteName } from '../common/utils'
import { FormInputText } from '../common/components/ui/form'
import { ReactNode, useState } from 'react'
import { useAlerts, useSession } from '../common/hooks'
import {
  InteraccionChatType,
  PreguntaChatType,
} from '../modules/chat/type/PreguntaChat'
import { useForm } from 'react-hook-form'
import { Constantes } from '../config'
import { imprimir } from '../common/utils/imprimir'
import { Icono } from '../common/components/ui'
import ThemeSwitcherButton from '../common/components/ui/botones/ThemeSwitcherButton'
import Image from 'next/image'
import { useAuth } from '../context/auth'
import { NavbarLogin } from '../common/components/ui/navbars/NavbarLogin'
import { LayoutUser } from '../common/components/layouts'
import { time } from 'console'

export const chatPrueba = [
  {
    pregunta: 'hola',
  },
  {
    respueta: 'hola soy un chat',
  },
  {
    pregunta: 'que te puedo pregunta',
  },
  {
    respueta: 'lo que desees',
  },
]

const Inicio: NextPage = () => {
  /*   const nombreSitio: string = siteName() */
  const { usuario } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [historialChat, setHistorialChat] = useState<
    Array<InteraccionChatType>
  >([])
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const resolverPregunta = async (data: PreguntaChatType) => {
    const historialCopia = [...historialChat]
    historialCopia.push({
      pregunta: data.textoPregunta,
    })
    setHistorialChat(historialCopia)
    await resolverPreguntaPeticion({
      textoPregunta: data.textoPregunta,
    })
  }

  const resolverPreguntaPeticion = async (data: PreguntaChatType) => {
    try {
      setLoading(true)
      //await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/comunicacion`,
        method: 'post',
        body: { ...data },
        withCredentials: false,
      })

      /*  const respuesta formateado=""
        for (let i in respuesta.data) {
          const item = respuesta.data[i]
          if(item=="*"){
            
          }
        
        } */

      const historialCopia = [...historialChat]
      historialCopia.push({
        pregunta: data.textoPregunta,
      })
      historialCopia.push({
        respueta: respuesta.datos,
      })
      setHistorialChat(historialCopia)
    } catch (e) {
      imprimir(`Error al crear o actualizar módulo`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const { handleSubmit, control } = useForm<PreguntaChatType>({
    defaultValues: {
      textoPregunta: '',
    },
  })
  const children: ReactNode = (
    <Container maxWidth="md">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="space-between"
        justifyContent={historialChat.length > 0 ? 'space-between' : 'center'}
        style={{ minHeight: '100vh' }}
      >
        <Box>
          <Box height={'70px'} />

          <Box display="flex" flexDirection={'column'}>
            <Typography
              variant={'h6'}
              component="h1"
              sx={{ flexGrow: 1, fontWeight: '700' }}
            >
              <Image
                src={`/logoubp.png`}
                alt={'logo'}
                width="80"
                height="50"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  opacity: '40%',
                }}
              />
              TRANSFORMACIÓN DIGITAL E INNOVACIÓN EMPRESARIAL
            </Typography>
            <Box height={'20px'} />
            <Typography variant={'body1'} color={'text.secondary'}>
              <Icono fontSize="medium" color="secondary">
                smart_toy
              </Icono>{' '}
              Bienvenid@ al chatbot de la empresa, vamos a responder tus
              consultas...
            </Typography>
            <Box height={'20px'} />
          </Box>

          {historialChat.map((interaccion) => (
            <>
              {interaccion.pregunta && (
                <Grid container direction="row" justifyContent={'end'}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: 'lightgray',
                      borderRadius: '20px',
                      padding: 1,
                      margin: 1,
                    }}
                  >
                    {interaccion.pregunta}
                  </Box>
                </Grid>
              )}
              {interaccion.respueta && (
                <Grid container direction="row" justifyContent={'start'}>
                  <Box
                    sx={{
                      padding: 1,
                      margin: 1,
                      display: 'flex',
                      gap: 3,
                    }}
                  >
                    <Icono>smart_toy</Icono>
                    {`${interaccion.respueta}`}
                  </Box>
                </Grid>
              )}
            </>
          ))}
          {loading && (
            <Grid container direction="row" justifyContent={'start'}>
              <Box
                sx={{
                  padding: 1,
                  margin: 1,
                  display: 'flex',
                  gap: 3,
                }}
              >
                <Icono>smart_toy</Icono>
                estamos procesando su pregunta ...
                <CircularProgress size="30px" />
              </Box>
            </Grid>
          )}
        </Box>

        <form onSubmit={handleSubmit(resolverPregunta)}>
          <Grid container direction="row" spacing={2} paddingBottom={5}>
            <Grid item xs={12} md={11}>
              <FormInputText
                id={'textoPregunta'}
                control={control}
                name="textoPregunta"
                label=""
                disabled={loading}
                rules={{ required: 'Este campo es requerido' }}
                borderRadius="30px"
              />
            </Grid>
            <Grid item xs={12} md={1} alignContent={'center'}>
              <Button
                variant={'contained'}
                disabled={loading}
                type={'submit'}
                sx={{ borderRadius: '20px' }}
              >
                Preguntar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Container>
  )
  return usuario ? (
    <LayoutUser title={`Documento - ${siteName()}`}>{children}</LayoutUser>
  ) : (
    <>
      <NavbarLogin />
      {children}
    </>
  )
}

export default Inicio
