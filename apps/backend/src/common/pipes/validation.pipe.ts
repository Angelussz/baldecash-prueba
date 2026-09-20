import {
  ValidationPipe as NestValidationPipe,
  ValidationPipeOptions,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface ValidationExceptionResponse {
  statusCode: number;
  message: string;
  validationErrors: ValidationError[];
}

export class ValidationPipe extends NestValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors: ValidationError[]) => {
        const response: ValidationExceptionResponse = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Error de validación',
          validationErrors: errors,
        };
        return new HttpException(response, HttpStatus.UNPROCESSABLE_ENTITY);
      },
    });
  }
}
