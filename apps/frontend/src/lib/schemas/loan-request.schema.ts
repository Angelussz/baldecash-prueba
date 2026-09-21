import { z } from 'zod';

export const loanRequestSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, 'El DNI debe contener exactamente 8 dígitos'),
  nombres: z.string().min(1, 'Los nombres son requeridos').max(100, 'Máximo 100 caracteres'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos').max(100, 'Máximo 100 caracteres'),
  correo: z.string().email('El correo debe tener un formato válido'),
  telefono: z.string().regex(/^9\d{8}$/, 'El teléfono debe contener 9 dígitos y comenzar con 9'),
  monto: z.number()
    .min(1000, 'El monto mínimo es S/ 1,000')
    .max(10000, 'El monto máximo es S/ 10,000'),
  plazo: z.enum(['6', '12', '18', '24'], {
    message: 'El plazo solo puede ser 6, 12, 18 o 24 meses',
  }),
});

export type LoanRequestFormData = z.infer<typeof loanRequestSchema>;

export const plazoOptions = [
  { value: '6', label: '6 meses' },
  { value: '12', label: '12 meses' },
  { value: '18', label: '18 meses' },
  { value: '24', label: '24 meses' },
] as const;
