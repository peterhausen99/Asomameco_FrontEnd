export interface Asociado {
  IdAsociado: number
  Nombre: string
  NumeroCedula: string
  Estatus1: "Activo" | "Inactivo"
  Estado2: "Verificado" | "Confirmado" | "Pendiente" | "No"
  Correo: string
  Telefono: string
  FechaRegistro: string
  FechaModificacion: string
  IdUsuario: number
}

export interface Usuario {
  IdUsuario: number
  NombreUsuario: string
  Correo: string
  Rol: "Administrador" | "Asociado"
  Estado: "Activo" | "Inactivo"
}

export interface Evento {
  IdEvento: number
  Nombre: string
  Fecha: string
  Descripcion?: string
}

export interface Asistencia {
  IdAsistencia: number
  IdEvento: number
  IdAsociado: number
  FechaRegistro: string
  Observaciones?: string
}

