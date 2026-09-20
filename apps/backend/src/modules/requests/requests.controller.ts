import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { QueryRequestsDto } from './dto/query-requests.dto';
import { RequestsService } from './requests.service';

@Controller('solicitudes')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryRequestsDto) {
    return this.requestsService.findAll(query);
  }
}
