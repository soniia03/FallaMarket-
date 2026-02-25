import { TrajeFormData } from '../types';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateTrajeForm = (data: TrajeFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validación del nombre
  if (!data.nombre || data.nombre.trim().length === 0) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (data.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres';
  } else if (data.nombre.trim().length > 100) {
    errors.nombre = 'El nombre no puede exceder 100 caracteres';
  }

  // Validación del material
  if (!data.material || data.material.trim().length === 0) {
    errors.material = 'El material es obligatorio';
  } else if (data.material.trim().length > 50) {
    errors.material = 'El material no puede exceder 50 caracteres';
  }

  // Validación del propietario
  if (!data.propietario || data.propietario.trim().length === 0) {
    errors.propietario = 'El propietario es obligatorio';
  } else if (data.propietario.trim().length < 2) {
    errors.propietario = 'El propietario debe tener al menos 2 caracteres';
  } else if (data.propietario.trim().length > 100) {
    errors.propietario = 'El propietario no puede exceder 100 caracteres';
  }

  // Validación de la descripción
  if (!data.descripcion || data.descripcion.trim().length === 0) {
    errors.descripcion = 'La descripción es obligatoria';
  } else if (data.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
  } else if (data.descripcion.trim().length > 500) {
    errors.descripcion = 'La descripción no puede exceder 500 caracteres';
  }

  // Validación del precio
  if (data.precio === undefined || data.precio === null) {
    errors.precio = 'El precio es obligatorio';
  } else if (data.precio < 0) {
    errors.precio = 'El precio no puede ser negativo';
  } else if (data.precio > 10000) {
    errors.precio = 'El precio no puede exceder 10,000€';
  } else if (data.precio === 0) {
    errors.precio = 'El precio debe ser mayor que 0';
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getFirstError = (errors: ValidationErrors): string | null => {
  const errorKeys = Object.keys(errors);
  return errorKeys.length > 0 ? errors[errorKeys[0]] : null;
};