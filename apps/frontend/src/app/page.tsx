import { Metadata } from 'next';
import { LoanRequestForm } from '@/components/loan-request-form';

export const metadata: Metadata = {
  title: 'BaldeCash - Solicitud de Financiamiento',
  description: 'Solicita tu préstamo personal de forma rápida y segura',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface">
      <LoanRequestForm />
    </main>
  );
}
