import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  delay,
  guardarCookie,
  InterpreteMensajes,
  leerCookie,
} from '../../common/utils'
import { Servicios } from '../../common/services'
import { Constantes } from '../../config'
import { useRouter } from 'next/router'
import { useFullScreenLoading } from '../ui'
import { useAlerts, useCasbinEnforcer, useSession } from '../../common/hooks'
import { imprimir } from '../../common/utils/imprimir'
import {
  LoginType,
  UsuarioType,
} from '../../modules/login/types/loginTypes'

interface ContextProps {
  estaAutenticado: boolean
  usuario: UsuarioType | null
  obtenerPerfil: () => Promise<void>
  ingresar: ({ usuario, contrasenia }: LoginType) => Promise<void>
  progresoLogin: boolean
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

interface AuthContextType {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState<UsuarioType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const router = useRouter()

  const { sesionPeticion, borrarCookiesSesion } = useSession()



  const inicializarUsuario = async () => {
    const token = leerCookie('token')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      mostrarFullScreen()
      await delay(1000)
    } catch (error: Error | any) {
      imprimir(`Error durante inicializarUsuario 🚨`, typeof error, error)
      borrarSesionUsuario()
      await router.replace({
        pathname: '/login',
      })
      throw error
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const borrarSesionUsuario = () => {
    setUser(null)
    borrarCookiesSesion()
  }

  useEffect(() => {
    if (!router.isReady) return

    inicializarUsuario()
      .catch(imprimir)
      .finally(() => {
        imprimir('Verificación de login finalizada 👨‍💻')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const login = async ({ usuario, contrasenia }: LoginType) => {
    try {
      setLoading(true)

      await delay(1000)
      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/auth`,
        body: { usuario, contrasenia: contrasenia },
        headers: {},
      })
      
      guardarCookie('token', respuesta.datos?.access_token)
      guardarCookie('user', JSON.stringify(respuesta.datos?.user))
      imprimir(`Token ✅: ${respuesta.datos?.access_token}`)
      setUser(respuesta.datos?.user)
      imprimir(`Usuarios ✅`, respuesta.datos)

      mostrarFullScreen()
      await delay(1000)
      await router.replace({
        pathname: '/admin/home',
      })
    } catch (e) {
      imprimir(`Error al iniciar sesión: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
      borrarSesionUsuario()
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }
  const obtenerPerfil = async () => {
    try {
      await delay(1000)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/perfil/${user?.id}`,
        headers: {
          Authorization: `Bearer ${leerCookie('token') ?? ''}`,
        },
      })
      guardarCookie('user', JSON.stringify(respuesta.datos))
      setUser(respuesta.datos)
      imprimir(`Usuarios ✅`, respuesta.datos)

    } catch (e) {
      imprimir(`Error al obtener el perfil: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }

  useEffect(() => {
    if (leerCookie('token')) {
      const user = leerCookie('user')
      setUser(user ? JSON.parse(user) : null)
    }
  }, [])
  return (
    <AuthContext.Provider
      value={{
        estaAutenticado: !!user && !loading,
        usuario: user,
        obtenerPerfil: obtenerPerfil,
        ingresar: login,
        progresoLogin: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
