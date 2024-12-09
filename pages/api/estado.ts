// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  commitDate,
  commitID,
  nombreRama,
  serviceName,
  versionNumber,
} from '../../common/utils'
import { Constantes } from '../../config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    servicio: serviceName(),
    version: versionNumber(),
    entorno: Constantes.appEnv,
    estado: `Servicio funcionando correctamente 🙌`,
    hora: new Date().getTime(),
    b: await nombreRama(),
    cid: await commitID(),
    cd: await commitDate(),
  })
}
