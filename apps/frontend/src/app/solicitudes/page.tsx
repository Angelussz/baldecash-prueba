import { Metadata } from 'next';
import { RequestList } from '@/components/request-list';

export const metadata: Metadata = {
  title: 'BaldeCash - Gestión de Solicitudes',
  description: 'Consulta las solicitudes de financiamiento registradas',
};

export default function SolicitudesPage() {
  return (
    <main className="bg-surface flex-1">
      <RequestList />
    </main>
  );
}