import React, { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  Fade,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { TableSkeletonBody } from './CustomSkeleton'
import { Icono } from '../Icono'
import { CriterioOrdenType } from './ordenTypes'
import { ToggleOrden } from './utils'
import { IconoBoton } from '../botones/IconoBoton'

export interface CollapsibleObjecto {
  obteto: (idFila: number) => ReactNode
  nroColumnas: number
}
export interface ContenidoFilaType {
  idFila: number
  columnasFila: Array<ReactNode>
}
export interface CustomDataTableType {
  titulo?: string
  descripcion?: string
  tituloPersonalizado?: ReactNode
  cabeceraPersonalizada?: ReactNode
  error?: boolean
  cargando?: boolean
  acciones?: Array<ReactNode>
  cambioOrdenCriterios?: (nuevosCriterios: Array<CriterioOrdenType>) => void
  columnas: Array<CriterioOrdenType>
  filtros?: ReactNode
  contenidoTabla: Array<ContenidoFilaType>
  paginacion?: ReactNode
  seleccionable?: boolean
  seleccionados?: (indices: Array<number>) => void
  collapsibleObjecto?: CollapsibleObjecto
}

export const CustomDesktopDataTable = ({
  titulo,
  descripcion,
  tituloPersonalizado,
  cabeceraPersonalizada,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
  cambioOrdenCriterios,
  filtros,
  contenidoTabla,
  paginacion,
  seleccionable,
  seleccionados,
  collapsibleObjecto,
}: CustomDataTableType) => {
  const [todoSeleccionado, setTodoSeleccionado] = useState(false)

  const cambiarTodoSeleccionado = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTodoSeleccionado(event.target.checked)
  }

  const [indicesSeleccionados, setIndicesSeleccionados] = useState<
    Array<boolean>
  >([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.name)
    setIndicesSeleccionados((prev) => {
      const newState = [...prev]
      newState[index] = event.target.checked
      return newState
    })
  }

  useEffect(
    () => {
      if (seleccionados) {
        seleccionados(
          indicesSeleccionados.reduce(
            (resulltado: Array<number>, value, index) => {
              if (value) {
                resulltado.push(index)
              }
              return resulltado
            },
            []
          )
        )
      }

      if (
        indicesSeleccionados.filter((value) => value).length ==
          indicesSeleccionados.length &&
        indicesSeleccionados.length != 0
      )
        setTodoSeleccionado(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(indicesSeleccionados)]
  )

  useEffect(
    () => {
      setIndicesSeleccionados(
        new Array(contenidoTabla.length).fill(todoSeleccionado)
      )
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [todoSeleccionado]
  )

  useEffect(
    () => {
      if (!cargando) {
        setIndicesSeleccionados(new Array(contenidoTabla.length).fill(false))
        setTodoSeleccionado(false)
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [cargando, contenidoTabla.length]
  )

  return (
    <Box sx={{ pb: 2 }}>
      {/*título y acciones*/}
      {!cabeceraPersonalizada && (
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {titulo ? (
            <Grid >
              <Typography variant={'h5'} sx={{ fontWeight: '600' }}>
                {`${titulo}`}
              </Typography>
              {descripcion && (
                <Typography sx={{ pt: 1, pb:1, color: 'gray' }} fontSize={14}>
                  {`${descripcion}`}
                </Typography>
              )}
            </Grid>
          ) : tituloPersonalizado ? (
            tituloPersonalizado
          ) : (
            <Box/>
          )}
          <Box>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {seleccionable &&
                indicesSeleccionados.filter((value) => value).length > 0 && (
                  <Box sx={{ mx: 1 }}>
                    <Typography key={'contador'} variant={'subtitle2'}>
                      {`${
                        indicesSeleccionados.filter((value) => value).length
                      } seleccionados`}
                    </Typography>
                  </Box>
                )}
              {acciones.map((accion, index) => (
                <div key={`accion-id-${index}`}>{accion}</div>
              ))}
            </Grid>
          </Box>
        </Grid>
      )}
      {cabeceraPersonalizada && cabeceraPersonalizada}
      {/* filtros */}
      <Box
        sx={{
          pt: filtros ? 1 : 2,
          pb: filtros ? 3 : 1,
        }}
      >
        {filtros}
      </Box>
      {/*Contenedor de la tabla*/}
      <Card
        sx={{
          borderRadius: 2,
          pt: 3,
          pl: { sm: 5, md: 5, xl: 5 },
          pr: { sm: 5, md: 5, xl: 5 },
          pb: { sm: 4, md: 4, xl: 4 },
          mb: { sm: 5, md: 5, xl: 5 },
          backgroundColor: {},
          boxShadow: {},
        }}
      >
        {
          <Box>
            {error ? (
              <TableContainer
                sx={{
                  borderRadius: 2, // Bordes redondeados para el contenedor de la tabla
                  overflow: 'hidden', // Asegura que los bordes redondeados no se corten
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Grid
                          container
                          spacing={0}
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          justifyItems={'center'}
                        >
                          <Grid item xs={3} xl={4}>
                            <Typography
                              variant={'body1'}
                              component="h1"
                              noWrap={true}
                              alignItems={'center'}
                            >
                              {`Error obteniendo información`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : contenidoTabla.length == 0 && !cargando ? (
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Grid
                          container
                          spacing={0}
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          justifyItems={'center'}
                        >
                          <Grid item xs={3} xl={4}>
                            <Typography
                              variant={'body1'}
                              component="h1"
                              noWrap={true}
                              alignItems={'center'}
                            >
                              {`Sin registros`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box>
                {
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {seleccionable && (
                            <TableCell
                              key={`cabecera-id-seleccionar`}
                              sx={{ p: 1.2 }}
                            >
                              <Checkbox
                                checked={todoSeleccionado}
                                disabled={cargando}
                                onChange={cambiarTodoSeleccionado}
                                indeterminate={
                                  indicesSeleccionados.filter((value) => value)
                                    .length != indicesSeleccionados.length &&
                                  indicesSeleccionados.filter((value) => value)
                                    .length > 0
                                }
                              />
                            </TableCell>
                          )}
                          {columnas.map((columna, index) => (
                            <TableCell
                              key={`cabecera-id-${index}`}
                              sx={{ p: 1.2 }}
                            >
                              {columna.ordenar ? (
                                <Button
                                  disabled={cargando}
                                  style={{
                                    justifyContent: 'flex-start',
                                    minWidth: '0',
                                    padding: '0 1',
                                  }}
                                  onClick={() => {
                                    const nuevosCriterios = [...columnas] // crea una copia del array original

                                    if (cambioOrdenCriterios) {
                                      cambioOrdenCriterios(
                                        nuevosCriterios.map(
                                          (value, indice) => ({
                                            ...value,
                                            ...{
                                              orden:
                                                index == indice
                                                  ? ToggleOrden(value.orden)
                                                  : undefined,
                                            },
                                          })
                                        )
                                      )
                                    }
                                  }}
                                >
                                  <Typography
                                    variant={'subtitle1'}
                                    color="text.primary"
                                    fontWeight={'600'}
                                    align={'left'}
                                    noWrap
                                  >
                                    {columna.nombre}
                                  </Typography>
                                  {columna.orden && <Box width={'10px'} />}
                                  {columna.orden && (
                                    <Icono
                                      fontSize={'inherit'}
                                      color={'secondary'}
                                    >
                                      {columna.orden == 'asc'
                                        ? 'north'
                                        : 'south'}
                                    </Icono>
                                  )}
                                </Button>
                              ) : (
                                <Typography
                                  variant={'subtitle1'}
                                  color="text.primary"
                                  fontWeight={'600'}
                                  align={'left'}
                                  noWrap
                                >
                                  {columna.nombre}
                                </Typography>
                              )}
                            </TableCell>
                          ))}
                          {collapsibleObjecto && <TableCell></TableCell>}
                        </TableRow>
                      </TableHead>
                      {cargando ? (
                        <TableSkeletonBody
                          filas={10}
                          columnas={columnas.length + (seleccionable ? 1 : 0)}
                        />
                      ) : (
                        <TableBody>
                          {contenidoTabla.map(
                            (contenidoFila, indexContenidoTabla) => (
                              <Row
                                key={`row-id-${indexContenidoTabla}`}
                                contenidoFila={contenidoFila}
                                indexContenidoTabla={indexContenidoTabla}
                                seleccionable={seleccionable}
                                indicesSeleccionados={indicesSeleccionados}
                                cargando={cargando}
                                handleChange={handleChange}
                                collapsibleObjecto={collapsibleObjecto}
                              />
                            )
                          )}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                }
                {paginacion}
              </Box>
            )}
          </Box>
        }
      </Card>
    </Box>
  )
}

export const Row = (props: {
  contenidoFila: any
  indexContenidoTabla: number
  seleccionable: boolean | undefined
  indicesSeleccionados: Array<boolean>
  cargando: boolean
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  collapsibleObjecto?: CollapsibleObjecto
}) => {
  const {
    contenidoFila,
    indexContenidoTabla,
    indicesSeleccionados,
    handleChange,
    seleccionable,
    cargando,
    collapsibleObjecto,
  } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow hover={true}>
        {seleccionable && (
          <TableCell key={`row-id-seleccionar-${indexContenidoTabla}`}>
            <Fade in={!cargando} timeout={1000}>
              <Box>
                {indicesSeleccionados.length > indexContenidoTabla && (
                  <Checkbox
                    checked={indicesSeleccionados[indexContenidoTabla]}
                    onChange={handleChange}
                    name={`${indexContenidoTabla}`}
                  />
                )}
              </Box>
            </Fade>
          </TableCell>
        )}
        {contenidoFila.columnasFila.map(
          (contenido: any, indexContenidoFila: any) => (
            <TableCell
              key={`celda-id-${indexContenidoTabla}-${indexContenidoFila}`}
              sx={{ p: 1.2 }}
            >
              <Fade in={!cargando} timeout={1000}>
                <Box>{contenido}</Box>
              </Fade>
            </TableCell>
          )
        )}

        {collapsibleObjecto && (
          <TableCell sx={{ p: 1.2 }} key={`celda-id-unic`}>
            {/*button para el collapse*/}
            <Box className="actions">
              <IconoBoton
                accion={() => setOpen(!open)}
                descripcion="integrantes"
                icono={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                variante="icono"
                id="idbtn"
                texto="integrar"
              />
            </Box>
          </TableCell>
        )}
      </TableRow>
      {collapsibleObjecto && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 4, paddingTop: 4 }}
            colSpan={collapsibleObjecto.nroColumnas + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              {collapsibleObjecto.obteto(contenidoFila.idFila)}
              {/* {collapsibleObjecto.obteto('1')} */}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}
