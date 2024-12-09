import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { delay, InterpreteMensajes } from '../../../../common/utils'
import { Constantes } from '../../../../config'

import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputText } from '../../../../common/components/ui/form'
import ProgresoLineal from '../../../../common/components/ui/progreso/ProgresoLineal'
import { useAlerts, useSession } from '../../../../common/hooks'
import { imprimir } from '../../../../common/utils/imprimir'
import {
    UsuarioType,
} from '../perfilTypes'

export interface UsuarioModalType {
    user?: UsuarioType | null
    accionCorrecta: () => void
    accionCancelar: () => void
}

export const UsuarioModal = ({
    user,
    accionCorrecta,
    accionCancelar,
}: UsuarioModalType) => {
    const [loadingModal, setLoadingModal] = useState<boolean>(false)

    // Hook para mostrar alertas
    const { Alerta } = useAlerts()

    // Proveedor de la sesión
    const { sesionPeticion } = useSession()

    const { handleSubmit, control } = useForm<UsuarioType>({
        defaultValues: {
            id: user?.id,
            nombres: user?.nombres,
            apellidos: user?.apellidos,
            ci: user?.ci,
            correo: user?.correo,
        },
    })

    const guardarActualizarDocumento = async (
        data: UsuarioType
    ) => {
        await guardarActualizarDocumentoPeticion(data)
    }

    const guardarActualizarDocumentoPeticion = async (
        user: UsuarioType
    ) => {
        try {
            setLoadingModal(true)
            await delay(1000)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/usuarios/${user.id}`,
                method:'patch',
                body: user,
            })
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success',
            })
            accionCorrecta()
        } catch (e) {
            imprimir(`Error al crear o actualizar user`, e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoadingModal(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(guardarActualizarDocumento)}>
            <DialogContent dividers>
                <Grid container direction={'column'} justifyContent="space-evenly">
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid item xs={12} sm={12} md={6}>
                            <FormInputText
                                id={'nombres'}
                                control={control}
                                name="nombres"
                                label="nombres"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <FormInputText
                                id={'apellidos'}
                                control={control}
                                name="apellidos"
                                label="apellidos"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                    </Grid>
                    <Box height={'15px'} />
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormInputText
                                id={'ci'}
                                control={control}
                                name="ci"
                                label="ci"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormInputText
                                id={'correo'}
                                control={control}
                                name="correo"
                                label="correo"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                    </Grid>
                    <Box height={'10px'} />
                    <ProgresoLineal mostrar={loadingModal} />
                    <Box height={'5px'} />
                </Grid>
            </DialogContent>
            <DialogActions
                sx={{
                    my: 1,
                    mx: 2,
                    justifyContent: {
                        lg: 'flex-end',
                        md: 'flex-end',
                        xs: 'center',
                        sm: 'center',
                    },
                }}
            >
                <Button
                    variant={'outlined'}
                    disabled={loadingModal}
                    onClick={accionCancelar}
                >
                    Cancelar
                </Button>
                <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
                    Guardar
                </Button>
            </DialogActions>
        </form>
    )
}
