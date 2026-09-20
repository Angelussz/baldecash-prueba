import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoSolicitud } from '@prisma/client';

export class QueryRequestsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(EstadoSolicitud, {
    message: 'El estado solo puede ser pendiente, aprobada o rechazada',
  })
  estado?: EstadoSolicitud;
}
