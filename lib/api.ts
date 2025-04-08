// Servicios para interactuar con la API

import type { Asociado, Evento, Asistencia } from "./api-types"

const API_URL = "http://localhost:5000/api"

// Funciones para manejar errores
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Error en la solicitud")
  }
  return response.json()
}

// API de Asociados
export const asociadoApi = {
  getAll: async (): Promise<Asociado[]> => {
    const response = await fetch(`${API_URL}/Asociated`)
    return handleResponse(response)
  },

  getById: async (id: number): Promise<Asociado> => {
    const response = await fetch(`${API_URL}/Asociated/${id}`)
    return handleResponse(response)
  },

  create: async (asociado: Asociado): Promise<Asociado> => {
    const response = await fetch(`${API_URL}/Asociated`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asociado),
    })
    return handleResponse(response)
  },

  update: async (asociado: Asociado): Promise<void> => {
    const response = await fetch(`${API_URL}/Asociated`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asociado),
    })
    return handleResponse(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/Asociated/${id}`, {
      method: "DELETE",
    })
    return handleResponse(response)
  },

  // Función para buscar asociados por cédula o número de asociado
  buscar: async (termino: string): Promise<Asociado[]> => {
    const todos = await asociadoApi.getAll()
    return todos.filter(
      (a) => a.cedula.includes(termino) || a.numeroAsociado.toLowerCase().includes(termino.toLowerCase()),
    )
  },
}

// API de Eventos
export const eventoApi = {
  getAll: async (): Promise<Evento[]> => {
    const response = await fetch(`${API_URL}/Event`)
    return handleResponse(response)
  },

  getById: async (id: number): Promise<Evento> => {
    const response = await fetch(`${API_URL}/Event/${id}`)
    return handleResponse(response)
  },

  create: async (evento: Evento): Promise<Evento> => {
    const response = await fetch(`${API_URL}/Event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(evento),
    })
    return handleResponse(response)
  },

  update: async (evento: Evento): Promise<void> => {
    const response = await fetch(`${API_URL}/Event`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(evento),
    })
    return handleResponse(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/Event/${id}`, {
      method: "DELETE",
    })
    return handleResponse(response)
  },
}

// API de Asistencia
export const asistenciaApi = {
  getAll: async (): Promise<Asistencia[]> => {
    const response = await fetch(`${API_URL}/Assistance`)
    return handleResponse(response)
  },

  getById: async (id: number): Promise<Asistencia> => {
    const response = await fetch(`${API_URL}/Assistance/${id}`)
    return handleResponse(response)
  },

  create: async (asistencia: Asistencia): Promise<Asistencia> => {
    const response = await fetch(`${API_URL}/Assistance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asistencia),
    })
    return handleResponse(response)
  },

  update: async (asistencia: Asistencia): Promise<void> => {
    const response = await fetch(`${API_URL}/Assistance`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asistencia),
    })
    return handleResponse(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/Assistance/${id}`, {
      method: "DELETE",
    })
    return handleResponse(response)
  },

  // Obtener asistencias por evento
  getByEvento: async (eventoId: number): Promise<Asistencia[]> => {
    const todas = await asistenciaApi.getAll()
    return todas.filter((a) => a.eventoId === eventoId)
  },
}

// Definir las interfaces para las estadísticas
interface EstadisticasEvento {
  id: number
  nombre: string
  fecha: string
  asistentes: number
  porcentaje: number
}

interface EstadisticasAsociado {
  id: number
  nombre: string
  numeroAsociado: string
  asistencias: number
  porcentaje: number
}

// Funciones para estadísticas
export const estadisticasApi = {
  // Obtener estadísticas de eventos
  getEstadisticasEventos: async (): Promise<EstadisticasEvento[]> => {
    const [eventos, asistencias, asociados] = await Promise.all([
      eventoApi.getAll(),
      asistenciaApi.getAll(),
      asociadoApi.getAll(),
    ])

    const totalAsociados = asociados.length

    return eventos.map((evento) => {
      const asistentesEvento = asistencias.filter((a) => a.eventoId === evento.id).length
      const porcentaje = totalAsociados > 0 ? Math.round((asistentesEvento / totalAsociados) * 100) : 0

      return {
        id: evento.id!,
        nombre: evento.nombre,
        fecha: evento.fecha,
        asistentes: asistentesEvento,
        porcentaje,
      }
    })
  },

  // Obtener estadísticas de asociados
  getEstadisticasAsociados: async (): Promise<EstadisticasAsociado[]> => {
    const [eventos, asistencias, asociados] = await Promise.all([
      eventoApi.getAll(),
      asistenciaApi.getAll(),
      asociadoApi.getAll(),
    ])

    const totalEventos = eventos.length

    return asociados.map((asociado) => {
      const asistenciasAsociado = asistencias.filter((a) => a.asociadoId === asociado.id).length
      const porcentaje = totalEventos > 0 ? Math.round((asistenciasAsociado / totalEventos) * 100) : 0

      return {
        id: asociado.id!,
        nombre: asociado.nombre,
        numeroAsociado: asociado.numeroAsociado,
        asistencias: asistenciasAsociado,
        porcentaje,
      }
    })
  },
}
