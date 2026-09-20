import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationError {
  property: string;
  constraints?: Record<string, string>;
}

interface HttpExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  validationErrors?: ValidationError[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse =
      exception.getResponse() as HttpExceptionResponse;

    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      const validationErrors = exceptionResponse.validationErrors;

      if (validationErrors && Array.isArray(validationErrors)) {
        response.status(status).json({
          statusCode: status,
          message: 'Error de validación',
          errors: validationErrors.map((error) => ({
            field: error.property,
            message: Object.values(error.constraints || {}).join(', '),
          })),
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        return;
      }

      const messages = exceptionResponse.message;
      if (Array.isArray(messages)) {
        response.status(status).json({
          statusCode: status,
          message: 'Error de validación',
          errors: messages.map((msg) => ({
            field: this.extractFieldName(msg),
            message: msg,
          })),
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        return;
      }
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractFieldName(message: string): string {
    const fieldPatterns: Record<string, RegExp> = {
      nombres: /nombres?/i,
      apellidos: /apellidos?/i,
      dni: /dni/i,
      correo: /correo|email/i,
      telefono: /telefono|teléfono/i,
      monto: /monto/i,
      plazo: /plazo/i,
      estado: /estado/i,
    };

    for (const [field, pattern] of Object.entries(fieldPatterns)) {
      if (pattern.test(message)) {
        return field;
      }
    }

    return 'unknown';
  }
}
