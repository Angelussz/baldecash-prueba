import { Injectable } from '@nestjs/common';
import { EstadoSolicitud } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { QueryRequestsDto } from './dto/query-requests.dto';
import {
  PaginatedResult,
  RequestEntity,
} from './entities/request.entity';

@Injectable()
export class RequestsService {
  private static readonly ANNUAL_RATE = 0.24;
  private static readonly MONTHLY_RATE =
    RequestsService.ANNUAL_RATE / 12;

  constructor(private readonly prisma: PrismaService) {}

  calculateMonthlyPayment(amount: number, term: number): number {
    const i = RequestsService.MONTHLY_RATE;
    const payment =
      (amount * (i * Math.pow(1 + i, term))) /
      (Math.pow(1 + i, term) - 1);
    return Math.round(payment * 100) / 100;
  }

  async create(dto: CreateRequestDto): Promise<RequestEntity> {
    const cuotaMensual = this.calculateMonthlyPayment(dto.monto, dto.plazo);

    const solicitud = await this.prisma.solicitud.create({
      data: {
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        dni: dto.dni,
        correo: dto.correo,
        telefono: dto.telefono,
        monto: dto.monto,
        plazo: dto.plazo,
        cuotaMensual,
        estado: EstadoSolicitud.pendiente,
      },
    });

    return {
      id: solicitud.id,
      nombres: solicitud.nombres,
      apellidos: solicitud.apellidos,
      dni: solicitud.dni,
      correo: solicitud.correo,
      telefono: solicitud.telefono,
      monto: Number(solicitud.monto),
      plazo: solicitud.plazo,
      cuotaMensual: Number(solicitud.cuotaMensual),
      estado: solicitud.estado,
      createdAt: solicitud.createdAt,
      updatedAt: solicitud.updatedAt,
    };
  }

  async findAll(
    query: QueryRequestsDto,
  ): Promise<PaginatedResult<RequestEntity>> {
    const { page = 1, limit = 10, estado } = query;
    const skip = (page - 1) * limit;

    const where = estado ? { estado } : {};

    const [solicitudes, total] = await Promise.all([
      this.prisma.solicitud.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.solicitud.count({ where }),
    ]);

    return {
      data: solicitudes.map((s) => ({
        id: s.id,
        nombres: s.nombres,
        apellidos: s.apellidos,
        dni: s.dni,
        correo: s.correo,
        telefono: s.telefono,
        monto: Number(s.monto),
        plazo: s.plazo,
        cuotaMensual: Number(s.cuotaMensual),
        estado: s.estado,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
