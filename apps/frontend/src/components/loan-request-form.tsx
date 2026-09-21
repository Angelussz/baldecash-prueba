'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanRequestSchema, LoanRequestFormData, plazoOptions } from '@/lib/schemas/loan-request.schema';
import { createRequest } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

export function LoanRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'success' | 'error' | 'info' }>({
    message: '',
    visible: false,
    type: 'success',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoanRequestFormData>({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: {
      dni: '',
      nombres: '',
      apellidos: '',
      correo: '',
      telefono: '',
      monto: 0,
      plazo: '12',
    },
  });

  const montoValue = watch('monto');
  const plazoValue = watch('plazo');

  const onSubmit = async (data: LoanRequestFormData) => {
    setIsSubmitting(true);
    try {
      await createRequest({
        nombres: data.nombres,
        apellidos: data.apellidos,
        dni: data.dni,
        correo: data.correo,
        telefono: data.telefono,
        monto: data.monto,
        plazo: Number(data.plazo),
      });
      setToast({
        message: '¡Solicitud enviada exitosamente!',
        visible: true,
        type: 'success',
      });
      window.setTimeout(() => {
        router.push('/solicitudes');
      }, 1200);
    } catch {
      setToast({
        message: 'Error al enviar la solicitud. Intente nuevamente.',
        visible: true,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-8 pb-8 flex flex-col gap-6 max-w-lg mx-auto">
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-on-surface">
          Solicitud de Préstamo
        </h1>
        <p className="text-sm text-on-surface-variant">
          Completa el formulario para solicitar tu préstamo personal.
        </p>
      </section>

      <section className="bg-surface-container rounded-xl p-4 shadow-sm flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant">Monto</span>
            <span className="text-[15px] font-bold text-on-surface tabular-nums">
              S/ {Number(montoValue || 0).toLocaleString('es-PE', { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant">Plazo</span>
            <span className="text-[15px] font-bold text-on-surface tabular-nums">
              {plazoValue || 12} meses
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant">Cuota Estimada</span>
            <span className="text-[15px] font-bold text-brand-blue tabular-nums">
              S/ {((Number(montoValue || 0) * 1.02) / Number(plazoValue || 12)).toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="DNI"
          placeholder="8 dígitos"
          maxLength={8}
          {...register('dni')}
          error={errors.dni?.message}
        />

        <Input
          label="Nombres Completos"
          placeholder="Ej. Carlos Eduardo"
          {...register('nombres')}
          error={errors.nombres?.message}
        />

        <Input
          label="Apellidos Completos"
          placeholder="Ej. Mendoza Paredes"
          {...register('apellidos')}
          error={errors.apellidos?.message}
        />

        <Input
          label="Correo Electrónico"
          placeholder="nombre@correo.com"
          type="email"
          {...register('correo')}
          error={errors.correo?.message}
        />

        <Input
          label="Teléfono Móvil"
          placeholder="999 888 777"
          maxLength={9}
          {...register('telefono')}
          error={errors.telefono?.message}
        />

        <Input
          label="Monto Solicitado"
          placeholder="0.00"
          prefix="S/"
          type="number"
          {...register('monto', { valueAsNumber: true })}
          error={errors.monto?.message}
          helperText="Mínimo S/ 1,000 - Máximo S/ 10,000"
        />

        <Select
          label="Plazo de Financiamiento"
          options={plazoOptions}
          {...register('plazo')}
          error={errors.plazo?.message}
        />

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>
            Enviar Solicitud
          </Button>
        </div>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
