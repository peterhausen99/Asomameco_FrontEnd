// Tipos de datos para la API

export interface Asociado {
  id?: number
  cedula: string
  nombre: string
  numeroAsociado: string
  email?: string
  telefono?: string
}

export interface Evento {
  id?: number
  nombre: string
  fecha: string
  descripcion?: string
}

export interface Asistencia {
  id?: number
  eventoId: number
  asociadoId: number
  fechaHora: string
  asociado?: Asociado
  evento?: Evento
}

// Tipos para respuestas y estadísticas
export interface EstadisticasEvento {
  id: number
  nombre: string
  fecha: string
  asistentes: number
  porcentaje: number
}

export interface EstadisticasAsociado {
  id: number
  nombre: string
  numeroAsociado: string
  asistencias: number
  porcentaje: number
}
