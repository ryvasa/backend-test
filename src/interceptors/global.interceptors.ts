import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
@Injectable()
export class GlobalInterceptors implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const request = context.switchToHttp().getRequest();
        const statusCode = response.statusCode;

        return {
          statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          data: data || null,
          error: statusCode < 400 && null,
        };
      }),
    );
  }
}
