// Configuración base de la API
// export const API_CONEXION = "http://localhost:3000/api";
export const API_CONEXION = "https://colochas-api.onrender.com/api";

// Versión de la API
export const API_VERSION = "v1";

// Timeout para las peticiones
export const API_TIMEOUT = 10000;

// Construir URL completa
const buildUrl = (endpoint: string): string => {
  return `${API_CONEXION}/${API_VERSION}${endpoint}`;
};

// Endpoints de la API
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: buildUrl('/auth/signUp'),
    LOGIN: buildUrl('/auth/login'),
    UPDATE_USER: (id: string) => buildUrl(`/auth/${id}`),
    GET_ALL_USERS: buildUrl('/auth'),
  },
  USERS: {
    BASE: buildUrl('/users'),
    BY_ID: (id: number) => buildUrl(`/users/${id}`),
    CREATE: buildUrl('/users'),
    UPDATE: (id: number) => buildUrl(`/users/${id}`),
    GET_ROLES: (id: number) => buildUrl(`/users/${id}/roles`),
    ASSIGN_ROLE: (id: number, roleId: number) => buildUrl(`/users/${id}/roles/${roleId}`),
    REMOVE_ROLE: (id: number, roleId: number) => buildUrl(`/users/${id}/roles/${roleId}`),
  },
  TURNOS: {
    BASE: buildUrl('/turnos'), // Devuelve todos los turnos activos
    BY_ID: (id: number) => buildUrl(`/turnos/${id}`),
    ESTADO_ALERTA: (id: number) => buildUrl(`/turnos/${id}/estado-alerta`),
  },
  VENTAS: {
    // BASE y MIS_VENTAS eliminados - Usar HISTORIAL.VENTAS en su lugar
    BY_ID: (id: number) => buildUrl(`/ventas/${id}`),
    BY_BOUCHER: (boucher: string) => buildUrl(`/ventas/boucher/${boucher}`),
    CREATE: buildUrl('/ventas'),
  },
  RESTRICCIONES: {
    BASE: buildUrl('/restricciones'),
    BY_ID: (id: number) => buildUrl(`/restricciones/${id}`),
    MULTIPLE: buildUrl('/restricciones/multiple'),
    VERIFICAR: buildUrl('/restricciones/verificar'),
    VERIFICAR_MULTIPLE: buildUrl('/restricciones/verificar-multiple'),
    BY_NUMERO: (turnoId: number, numero: number) => 
      buildUrl(`/restricciones/numero/${turnoId}/${numero}`),
    DELETE_MULTIPLE: buildUrl('/restricciones/multiple'),
  },
  CIERRES: {
    BASE: buildUrl('/cierres-turno'),
    CERRAR: buildUrl('/cierres-turno'),
    BY_TURNO_FECHA: (turnoId: number, fecha: string) => buildUrl(`/cierres-turno/turno/${turnoId}/fecha/${fecha}`),
    // VENTAS_BY_TURNO_FECHA eliminado - Usar HISTORIAL.VENTAS con filtros en su lugar
  },
  ALERTAS: {
    BASE: buildUrl('/alertas'),
    ACTIVAS: buildUrl('/alertas/activas'),
    BY_ID: (id: number) => buildUrl(`/alertas/${id}`),
    MARCAR: (id: number) => buildUrl(`/alertas/${id}/marcar`),
  },
  ROLES: {
    BASE: buildUrl('/roles'),
    BY_ID: (id: number) => buildUrl(`/roles/${id}`),
    PERMISOS: (id: number) => buildUrl(`/roles/${id}/permisos`),
    ASSIGN_PERMISO: (id: number, permisoId: number) => buildUrl(`/roles/${id}/permisos/${permisoId}`),
    REMOVE_PERMISO: (id: number, permisoId: number) => buildUrl(`/roles/${id}/permisos/${permisoId}`),
  },
  PERMISOS: {
    BASE: buildUrl('/permisos'),
    BY_ID: (id: number) => buildUrl(`/permisos/${id}`),
  },
  CONFIGURACIONES: {
    BASE: buildUrl('/configuraciones'),
    BY_ID: (id: number) => buildUrl(`/configuraciones/${id}`),
    BY_CLAVE: (clave: string) => buildUrl(`/configuraciones/clave/${clave}`),
  },
  KPIS: {
    BASE: buildUrl('/kpis'),
    VENTAS_HOY: buildUrl('/kpis/ventas-hoy'),
    NUMERO_MAS_VENDIDO: buildUrl('/kpis/numero-mas-vendido'), // Para implementación futura
    // NUMERO_MAS_GANADOR eliminado - No se utilizará más
    EMPLEADO_MAS_VENTAS: buildUrl('/kpis/empleado-mas-ventas'), // Para implementación futura
  },
  HISTORIAL: {
    BASE: buildUrl('/historial'),
    VENTAS: buildUrl('/historial/ventas'), // Endpoint consolidado para todas las consultas de ventas
    ANALISIS_NUMEROS: buildUrl('/historial/analisis-numeros'),
    REPORTE_CIERRE: buildUrl('/historial/reporte-cierre'),
  },
};

// Configuración para compatibilidad (deprecated - usar API_CONEXION)
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  API_VERSION: API_VERSION,
  TIMEOUT: API_TIMEOUT,
};
