import { useAlerts, useSession } from '../../../../common/hooks'
import { useState } from 'react'
import { imprimir } from '../../../../common/utils/imprimir'
import { InterpreteMensajes } from '../../../../common/utils'
import { Constantes } from '../../../../config'

export const useFetchSincronizacionDB = () => {
  const [sincronacionDBLoading, setsincronacionDBLoading] =
    useState<boolean>(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const sincronizarDBPeticion = async () => {
    try {
      setsincronacionDBLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/sincronizacion/basedatos`,
        method: 'get',
      })
      imprimir(`sincronizacion de preguntas frecuentes: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
    } catch (e) {
      imprimir(`Error estado pregunta`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setsincronacionDBLoading(false)
    }
  }
  return {
    sincronacionDBLoading: sincronacionDBLoading,
    sincronizarDBPeticion: sincronizarDBPeticion,
  }
}
