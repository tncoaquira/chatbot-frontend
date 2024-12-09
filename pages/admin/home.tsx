import type { NextPage } from 'next'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'
import { useAuth } from '../../context/auth'
import { LayoutUser } from '../../common/components/layouts'
import { Icono } from '../../common/components/ui'
import { useRouter } from 'next/router'
import { siteName, titleCase } from '../../common/utils'
import { MODULOS_ADMIN } from '../../config'
import { SincronizacionData } from '../../modules/admin/documentos/ui/SincronizacionData'
import { useFetchSincronizacionDB } from '../../modules/admin/documentos/hooks/useFetchSincronizacionDB'
const Home: NextPage = () => {
  const { usuario } = useAuth()

  const router = useRouter()
  const { sincronacionDBLoading, sincronizarDBPeticion } =
    useFetchSincronizacionDB()
  return (
    <LayoutUser title={`Home - ${siteName()}`}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid>
          <Typography
            variant={'h5'}
            component="h1"
            sx={{ flexGrow: 1, fontWeight: '600' }}
          >
            Bienvenid@ {titleCase(usuario?.nombres ?? '')}
          </Typography>
        </Grid>
      </Grid>
      <Grid>
        <Box height={'30px'} />
        <Typography sx={{ fontSize: 14 }}>
          Puedes ver los siguientes módulos:
        </Typography>
        <Box height={'5px'} />
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid container direction="row">
          {MODULOS_ADMIN.map((modulo, index1) => (
            <Grid container direction="row" key={`rolUsuario-${index1}`}>
              <Grid>
                <Box height={'20px'} />
                <Typography sx={{ fontSize: 14, fontWeight: '600' }}>
                  {modulo.label}
                </Typography>
                <Box height={'20px'} />
              </Grid>
              <Grid
                container
                direction="row"
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 2, sm: 8, md: 12, xl: 12 }}
              >
                {modulo.subModulo.map((subModulo, index2) => (
                  <Grid
                    item
                    xs={2}
                    sm={4}
                    md={4}
                    key={`$subModulo-${index1}-${index2}`}
                  >
                    <CardActionArea
                      sx={{
                        borderRadius: 3,
                      }}
                      onClick={async () => {
                        await router.push(subModulo.url)
                      }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                        }}
                      >
                        <CardContent>
                          <Grid container direction="row">
                            <Icono color={'primary'}>
                              {subModulo.propiedades.icono}
                            </Icono>
                            <Box height={'30px'} width={'10px'} />
                            <Typography
                              variant="caption"
                              sx={{ fontSize: 14, fontWeight: '600' }}
                            >
                              {`${subModulo.label}`}
                            </Typography>
                          </Grid>
                          <Typography variant="body2" sx={{ fontSize: 14 }}>
                            {`${subModulo.propiedades.descripcion}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </CardActionArea>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Box height={'20px'} />
      <Grid>
        <Typography sx={{ fontSize: 14, fontWeight: '600' }}>
          Sincronizacion
        </Typography>
      </Grid>
      <Box height={'20px'} />
      <Grid
        container
        direction="row"
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12, xl: 12 }}
      >
        <Grid item xs={2} sm={4} md={6} key={`$subModulo-${-2}-${-2}`}>
          <SincronizacionData
            titulo="Sincrononizar con la base de datos"
            descripcion=" No olvides sincronizar el base de datos relacional con la base
                  de conocimiento de chatbot, en caso de actualizacion"
            icon="table_rows"
            fecha="09/12/2024"
            sincronizacionPeticion={sincronizarDBPeticion}
            loading={sincronacionDBLoading}
          />
        </Grid>
        <Grid item xs={2} sm={4} md={6} key={`$subModulo-${-1}-${-1}`}>
          <SincronizacionData
            titulo="Sincrononizar con la sitio web"
            descripcion=" No olvides sincronizar el sitio web de la empresa con la base
                  de conocimiento de chatbot, en caso de actualizacion"
            icon="web"
            fecha="09/12/2024"
            sincronizacionPeticion={sincronizarDBPeticion}
            loading={false}
          />
        </Grid>
      </Grid>
      {/* <Box height={'40px'} />
      <Grid>
        <Typography sx={{ fontSize: 14 }}>
          Puedes vizualizar las estadisticas de tu chatbot:
        </Typography>
      </Grid>
      <Box height={'25px'} />
      <Grid>
        <Typography sx={{ fontSize: 14, fontWeight: '600' }}>
          Numero de consultas resueltas por el chatbot al mes
        </Typography>
      </Grid>
      <Box height={'20px'} />
      <Card
        sx={{
          borderRadius: 3,
          width: '800px',
          height: '300px',
        }}
      >
        <CardContent
          sx={{
            width: '800px',
            height: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="caption"
            color={'gray'}
            sx={{
              fontSize: 14,
            }}
          >
            Aun no hay consultas
          </Typography>
        </CardContent>
      </Card> */}
    </LayoutUser>
  )
}
export default Home
