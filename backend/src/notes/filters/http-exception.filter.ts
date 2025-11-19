import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        if ('message' in exceptionResponse && typeof exceptionResponse.message === 'string') {
          message = exceptionResponse.message;
        } else if ('message' in exceptionResponse && Array.isArray(exceptionResponse.message)) {
          message = exceptionResponse.message[0];
        }
      }
    } else if (exception instanceof Error) {
      // For validation errors and other standard errors
      message = exception.message;
    }
    
    // Log unexpected errors server-side
    if (status >= 500) {
      console.error('Unexpected server error:', exception);
    }
    
    response.status(status).json({
      message: message,
    });
  }
}