import { EstadoSolicitud } from '@prisma/client';

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
  estado: EstadoSolicitud;
  createdAt: Date;
  updatedAt: Date;
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
