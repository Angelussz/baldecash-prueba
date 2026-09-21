'use client';

import { useCallback, useEffect, useState } from 'react';
import { getRequests } from '@/lib/api';
import { RequestEntity, RequestStatus } from '@/lib/types';

type StatusFilter = 'all' | RequestStatus;

const statusFilters: { value: StatusFilter; label: string; dot?: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pendiente', label: 'Pendiente', dot: 'bg-error' },
  { value: 'aprobada', label: 'Aprobadas', dot: 'bg-secondary' },
  { value: 'rechazada', label: 'Rechazadas', dot: 'bg-outline' },
];

const pageSizeOptions = [8, 25, 50, 100];

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const emptyMeta: Meta = { page: 1, limit: 8, total: 0, totalPages: 1 };

function formatCurrency(value: number) {
  return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(request: RequestEntity) {
  return `${request.nombres.charAt(0)}${request.apellidos.charAt(0)}`.toUpperCase();
}

function getPageItems(current: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | 'ellipsis')[] = [1];

  if (current > 3) items.push('ellipsis');

  const startPage = Math.max(2, current - 1);
  const endPage = Math.min(totalPages - 1, current + 1);
  for (let p = startPage; p <= endPage; p += 1) {
    items.push(p);
  }

  if (current < totalPages - 2) items.push('ellipsis');
  items.push(totalPages);

  return items;
}

export function RequestList() {
  const [requests, setRequests] = useState<RequestEntity[]>([]);
  const [meta, setMeta] = useState<Meta>(emptyMeta);
  const [estado, setEstado] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getRequests({ page, limit, estado: estado === 'all' ? undefined : estado })
      .then((result) => {
        if (cancelled) return;
        setRequests(result.data);
        setMeta(result.meta);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setRequests([]);
        setMeta({ ...emptyMeta, limit, page });
        setError('Error al cargar las solicitudes. Intente nuevamente.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, limit, estado, refreshKey]);

  const reload = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setRefreshKey((key) => key + 1);
  }, []);

  const handleStatusChange = useCallback(
    (value: StatusFilter) => {
      setEstado(value);
      setPage(1);
      setError(null);
      setIsLoading(true);
    },
    [],
  );

  const handleLimitChange = useCallback(
    (value: number) => {
      setLimit(value);
      setPage(1);
      setError(null);
      setIsLoading(true);
    },
    [],
  );

  const handlePageChange = useCallback((value: number) => {
    setPage(value);
    setError(null);
    setIsLoading(true);
  }, []);

  const start = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);
  const pageItems = getPageItems(meta.page, meta.totalPages);

  return (
    <div className="px-4 pt-6 pb-10 max-w-5xl mx-auto flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight flex items-center gap-2">
          Gestión de Solicitudes
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-primary-fixed text-primary">
            {meta.total.toLocaleString('es-PE')} Registros
          </span>
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Consulta las solicitudes de financiamiento registradas en BaldeCash.
        </p>
      </section>

      <section className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {statusFilters.map((filter) => {
              const isActive = estado === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleStatusChange(filter.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {filter.dot && <span className={`w-2 h-2 rounded-full ${filter.dot}`} />}
                  {filter.label}
                </button>
              );
            })}
          </div>
          <span className="text-sm text-on-surface-variant">
            {isLoading
              ? 'Cargando solicitudes...'
              : `Mostrando ${start}-${end} de ${meta.total.toLocaleString('es-PE')} solicitudes`}
          </span>
        </div>

        <div className="rounded-xl border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Solicitud</th>
                  <th className="py-3 px-4 font-bold">Persona</th>
                  <th className="py-3 px-4 font-bold">Monto</th>
                  <th className="py-3 px-4 font-bold">Plazo</th>
                  <th className="py-3 px-4 font-bold">Cuota Mensual</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/30">
                {isLoading
                  ? Array.from({ length: 5 }, (_, index) => (
                      <tr key={`skeleton-${index}`} className="bg-surface-container-lowest">
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="h-3 w-20 bg-surface-container-high rounded animate-pulse" />
                            <div className="h-2.5 w-24 bg-surface-container-high rounded animate-pulse" />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-surface-container-high animate-pulse" />
                            <div className="flex flex-col gap-1.5">
                              <div className="h-3 w-32 bg-surface-container-high rounded animate-pulse" />
                              <div className="h-2.5 w-20 bg-surface-container-high rounded animate-pulse" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-3 w-20 bg-surface-container-high rounded animate-pulse" />
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-3 w-12 bg-surface-container-high rounded animate-pulse" />
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-3 w-20 bg-surface-container-high rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : requests.map((request) => (
                      <tr
                        key={request.id}
                        className="bg-surface-container-lowest hover:bg-surface-container-low/60 transition-colors"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-primary">#{request.id}</span>
                          <span className="block text-xs text-on-surface-variant">
                            {formatDate(request.createdAt)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-sm shrink-0">
                              {getInitials(request)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-on-surface truncate">
                                {request.nombres} {request.apellidos}
                              </span>
                              <span className="text-xs text-on-surface-variant">
                                DNI {request.dni}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-on-surface tabular-nums">
                          {formatCurrency(request.monto)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-on-surface-variant">
                          {request.plazo} meses
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-brand-green-dark tabular-nums">
                            {formatCurrency(request.cuotaMensual)}
                          </span>
                          <span className="text-xs text-on-surface-variant"> /mes</span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!isLoading && error ? (
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-error font-semibold">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-sm font-bold hover:bg-primary transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : null}

          {!isLoading && !error && requests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-on-surface-variant">
                No hay solicitudes{estado !== 'all' ? ' para este estado' : ''} registradas.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant">Filas por página:</span>
            <select
              value={limit}
              onChange={(event) => handleLimitChange(Number(event.target.value))}
              className="px-2.5 py-1 rounded-lg bg-surface-container-low text-sm text-on-surface focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} registros
                </option>
              ))}
            </select>
          </div>

          {!isLoading && meta.totalPages > 1 ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={meta.page <= 1}
                onClick={() => handlePageChange(Math.max(1, meta.page - 1))}
                className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                ‹
              </button>
              {pageItems.map((item, index) =>
                item === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-1 text-outline">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePageChange(item)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                      item === meta.page
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={meta.page >= meta.totalPages}
                onClick={() => handlePageChange(Math.min(meta.totalPages, meta.page + 1))}
                className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                ›
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}