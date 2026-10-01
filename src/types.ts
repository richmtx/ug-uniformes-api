export interface Env {
  BREVO_API_KEY: string;
}

export interface ContactoFormData {
  nombre: string;
  empresa?: string;
  telefono?: string;
  correo: string;
  tipoServicio?: string;
  descripcion: string;
}

export interface CotizarFormData {
  nombre: string;
  empresa?: string;
  telefono?: string;
  correo: string;
  tipoUniforme?: string;
  servicios?: string;
  cantidad?: string;
  detalles?: string;
}