import { CreateRequestPayload, RequestEntity, PaginatedResult, ApiErrorResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({
      statusCode: response.status,
      message: 'Error al procesar la solicitud',
      errors: [],
      timestamp: new Date().toISOString(),
      path: '',
    }));
    throw error;
  }
  return response.json();
}

export async function createRequest(payload: CreateRequestPayload): Promise<RequestEntity> {
  const response = await fetch(`${API_BASE_URL}/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<RequestEntity>(response);
}

export async function getRequests(params?: {
  page?: number;
  limit?: number;
  estado?: string;
}): Promise<PaginatedResult<RequestEntity>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.estado) searchParams.set('estado', params.estado);

  const query = searchParams.toString();
  const url = `${API_BASE_URL}/solicitudes${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  return handleResponse<PaginatedResult<RequestEntity>>(response);
}
