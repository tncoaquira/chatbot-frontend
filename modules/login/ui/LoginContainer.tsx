import { Box, Button, Card } from '@mui/material'
import { FormInputText } from '../../../common/components/ui/form'
import ProgresoLineal from '../../../common/components/ui/progreso/ProgresoLineal'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../../context/auth'
import { useForm } from 'react-hook-form'
import { LoginType } from '../types/loginTypes'
import { useRouter } from 'next/router'
import { useFullScreenLoading } from '../../../context/ui'
import { delay } from '../../../common/utils'

const LoginContainer = () => {
  const router = useRouter()

  const { ingresar, progresoLogin } = useAuth()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const { handleSubmit, control } = useForm<LoginType>({
    defaultValues: {
      usuario: '',
      contrasenia: '',
    },
  })

  const iniciarSesion = async ({ usuario, contrasenia }: LoginType) => {
    await ingresar({ usuario, contrasenia })
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 5,
        px: 6,
      }}
    >
      <form onSubmit={handleSubmit(iniciarSesion)}>
        <Box
          display={'grid'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ borderRadius: 12 }}
        >
          <Typography align={'center'} sx={{ fontWeight: '600' }}>
            Inicio de Sesión
          </Typography>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography
              fontSize={14}
              variant={'body1'}
              color={'text.secondary'}
            >
              
              Ingresa tus credenciales para iniciar sesión
            </Typography>
          </Box>
          <FormInputText
            id={'usuario'}
            control={control}
            name="usuario"
            label="Usuario"
            size={'medium'}
            labelVariant={'subtitle1'}
            disabled={progresoLogin}
            rules={{ required: 'Este campo es requerido' }}
          />
          <Box sx={{ mt: 1, mb: 1 }}></Box>
          <FormInputText
            id={'contrasenia'}
            control={control}
            name="contrasenia"
            label="Contraseña"
            size={'medium'}
            labelVariant={'subtitle1'}
            type={'password'}
            disabled={progresoLogin}
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres',
              },
            }}
          />
          <Box sx={{ mt: 0.5, mb: 0.5 }}>
            <ProgresoLineal mostrar={progresoLogin} />
          </Box>
          <Box display="flex" flex="1" justifyContent="start">
            <Button
              onClick={async () => {
                mostrarFullScreen()
                await delay(500)
                await router.push({
                  pathname: '/recuperacion',
                })
                ocultarFullScreen()
              }}
              size={'small'}
              variant={'text'}
              disabled={progresoLogin}
              color={'primary'}
            >
              <Typography fontSize={'small'} sx={{ fontWeight: '600' }}>
                ¿Olvidaste tu contraseña?
              </Typography>
            </Button>
          </Box>
          <Box sx={{ height: 15 }}></Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={progresoLogin}
          >
            <Typography sx={{ fontWeight: '600' }}>Iniciar sesión</Typography>
          </Button>
        </Box>
      </form>
    </Card>
  )
}

export default LoginContainer
