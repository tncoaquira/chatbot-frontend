
export interface PreguntaCRUDType {
  id: number
  textoPregunta: string
  idDocumento: number
  _status: string
}

export interface CrearEditarPreguntaCRUDType {
  id?: number 
  textoPregunta: string
  idDocumento?: number
}
