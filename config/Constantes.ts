export const Constantes = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  siteName: process.env.NEXT_PUBLIC_SITE_NAME,
  sitePath: process.env.NEXT_PUBLIC_PATH,
  appEnv: process.env.NEXT_PUBLIC_APP_ENV,
  ciudadaniaUrl: process.env.NEXT_PUBLIC_CIUDADANIA_URL,
  firmadorUrl: process.env.NEXT_PUBLIC_FIRMADOR_URL,
  apiOpenStreetMap: process.env.NEXT_PUBLIC_NOMINATIM_URL,
}

export const MODULOS_ADMIN = [
  {
    estado: 'ACTIVO',
    id: '1',
    label: 'Principal',
    url: '/principal',
    nombre: 'principal',
    propiedades: {
      icono: 'home',
      orden: 1,
      descripcion: 'Sección principal',
    },
    subModulo: [
      {
        estado: 'ACTIVO',
        id: '1',
        label: 'Inicio',
        url: '/admin/home',
        nombre: 'inicio',
        propiedades: {
          icono: 'home',
          orden: 1,
          descripcion: 'Vista de bienvenida con características del sistema',
        },
      },
      {
        estado: 'ACTIVO',
        id: '2',
        label: 'Chatbot',
        url: '/chat',
        nombre: 'chatbot',
        propiedades: {
          icono: 'home',
          orden: 1,
          descripcion: 'Iniciar conversacion con el chatbot de la empresa',
        },
      },
    ],
  },
  {
    estado: 'ACTIVO',
    id: '11',
    label: 'Configuracion',
    url: '/configuracion',
    nombre: 'configuracion',
    propiedades: {
      icono: 'home',
      orden: 3,
    },
    subModulo: [
      {
        estado: 'ACTIVO',
        id: '20',
        label: 'Documentos',
        url: '/admin/documentos',
        nombre: 'documentos',
        propiedades: {
          icono: 'checklist_rtl',
          orden: 4,
          descripcion: 'Información de documentos',
        },
      },
      {
        estado: 'ACTIVO',
        id: '20',
        label: 'Preguntas',
        url: '/admin/preguntas',
        nombre: 'preguntas',
        propiedades: {
          icono: 'checklist_rtl',
          orden: 4,
          descripcion: 'Información de las preguntas',
        },
      },
    ],
  },
]
export const LIMITE_PAGINADO = 10
