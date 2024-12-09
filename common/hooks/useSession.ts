import { delay, eliminarCookie, leerCookie } from '../utils'
import { imprimir } from '../utils/imprimir'
import { peticionFormatoMetodo, Servicios } from '../services'
import { verificarToken } from '../utils/token'
import { useFullScreenLoading } from '../../context/ui'
import { useRouter } from 'next/router'

export const useSession = () => {
  const router = useRouter()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const sesionPeticion = async ({
    url,
    method = 'get',
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormatoMetodo) => {
    try {
      if (withCredentials && !verificarToken(leerCookie('token') ?? '')) {
        imprimir(`Token caducado ⏳`)
        await cerrarSesion()
      }

      const cabeceras = {
        accept: 'application/json',
        Authorization: `Bearer ${leerCookie('token') ?? ''}`,
        ...headers,
      }

      imprimir(`enviando 🔐🌍`, body, method, url, cabeceras)
      const response = await Servicios.peticionHTTP({
        url,
        method: method,
        headers: cabeceras,
        body,
        params,
        responseType,
        withCredentials,
      })
      imprimir('respuesta 🔐📡', body, method, url, response)
      return response.data
    } catch (e: import('axios').AxiosError | any) {
      if (e.code === 'ECONNABORTED') {
        throw new Error('La petición está tardando demasiado')
      }

      if (Servicios.isNetworkError(e)) {
        throw new Error('Error en la conexión 🌎')
      }

      throw e.response?.data || 'Ocurrio un error desconocido'
    }
  }

  const borrarCookiesSesion = () => {
    eliminarCookie('token')
    eliminarCookie('user')
  }

  const cerrarSesion = async () => {
    try {
      mostrarFullScreen()
      await delay(1000)
      /* const token = leerCookie('token') */
      borrarCookiesSesion()
      await router.replace({
        pathname: '/login',
      })
      /*  const respuesta = await Servicios.get({
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        url: `${Constantes.baseUrl}/logout`,
      }) 
      imprimir(`finalizando con respuesta`, respuesta)
      
      if (respuesta?.url) {
        window.location.href = respuesta?.url
      } else {
        router.reload()
      }
      */
    } catch (e) {
      imprimir(`Error al cerrar sesión: `, e)
      router.reload()
    } finally {
      ocultarFullScreen()
    }
  }
  return { sesionPeticion, cerrarSesion, borrarCookiesSesion }
}
