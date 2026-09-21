export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada';

export interface LoanRequestForm {
  dni: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  monto: number;
  plazo: number;
}

export interface CreateRequestPayload {
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  telefono: string;
  monto: number;
  plazo: number;
}

export interface RequestEntity {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  telefono: string;
  monto: number;
  plazo: number;
  cuotaMensual: number;
  estado: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors: ValidationError[];
  timestamp: string;
  path: string;
}
