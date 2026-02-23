// Interfaz principal para los trajes basada en el modelo del backend
export interface Traje {
  _id?: string;
  nombre: string;
  material: string;
  propietario: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para las respuestas del backend
export interface BackendResponse<T> {
  status: T | string;
  data?: T;
}

// Interfaz para usuario (mantenida para compatibilidad futura)
export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  registrationDate?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  daysSinceRegistration?: number;
}

// Interfaz para respuestas API generales
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
  errors?: string[];
}

// Información de materiales comunes para trajes
export interface MaterialInfo {
  key: string;
  label: string;
  icon: string;
  color: string;
}

// Estados o tipos de trajes
export interface TipoTrajeInfo {
  key: string;
  label: string;
  class: string;
}