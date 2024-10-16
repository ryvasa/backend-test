import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeOrmFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      code = (exception as any).code;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
      code = 'ENTITY_NOT_FOUND';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: null,
      error: {
        code,
        message,
      },
    });
  }
}
