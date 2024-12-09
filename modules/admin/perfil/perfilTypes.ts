export interface cambioPassPeticion {
  oldPassword: string
  newPassword: string
}

export interface cambioPassForm {
  oldPassword: string
  newPassword: string
  newPassword2: string
}

export interface UsuarioType {
  id: string
  usuario: string
  nombres: string
  apellidos: string
  ci: string
  correo: string
}
