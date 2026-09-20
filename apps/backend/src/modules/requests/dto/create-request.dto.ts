import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @Min(1, { message: 'Los nombres no pueden estar vacíos' })
  nombres: string;

  @IsString()
  @Min(1, { message: 'Los apellidos no pueden estar vacíos' })
  apellidos: string;

  @IsString()
  @Matches(/^\d{8}$/, { message: 'El DNI debe contener exactamente 8 dígitos' })
  dni: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @IsString()
  @Matches(/^9\d{8}$/, {
    message: 'El teléfono debe contener 9 dígitos y comenzar con 9',
  })
  telefono: string;

  @IsInt()
  @Min(1000, { message: 'El monto debe estar entre S/ 1,000 y S/ 10,000' })
  @Max(10000, { message: 'El monto debe estar entre S/ 1,000 y S/ 10,000' })
  monto: number;

  @IsInt()
  @IsEnum([6, 12, 18, 24], {
    message: 'El plazo solo puede ser 6, 12, 18 o 24 meses',
  })
  plazo: number;
}
