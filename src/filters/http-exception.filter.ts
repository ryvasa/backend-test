import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let errorResponse: any;

    if (exception instanceof ThrottlerException) {
      status = HttpStatus.TOO_MANY_REQUESTS;
      errorResponse = {
        message: 'Too Many Requests',
        error: 'ThrottlerException',
        statusCode: status,
      };
    } else {
      status = exception.getStatus();
      errorResponse = exception.getResponse() as {
        message: string | string[];
        error: string;
        statusCode: number;
      };
    }

    console.log(exception);

    let messages: string;
    if (Array.isArray(errorResponse.message)) {
      messages = errorResponse.message[0];
    } else {
      messages = errorResponse.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        code: errorResponse.error,
        messages: messages,
      },
    });
  }
}
