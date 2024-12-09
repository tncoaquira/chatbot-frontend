
export interface DocumentoCRUDType {
  id: number
  titulo: string
  contenido: string
  link: string
  metadata_documento: string
  palabrasClave: string
  topics: string
  _status: string
}

export interface CrearEditarDocumentoCRUDType {
  id?: number 
  titulo: string
  contenido: string
  link: string
  metadata_documento: string
  palabrasClave: string
  topics: string
  preguntas: string
}
