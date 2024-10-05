import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DBError,
  ForeignKeyViolationError,
  UniqueViolationError,
  wrapError,
} from 'db-errors';
import { Response } from 'express';
import { InjectLogger } from '../decorators/inject-logger.decorator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@InjectLogger() private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorInstance: { message?: string } = {
      message: 'Something went wrong',
    };
    const responseObj: { status?: number; instance?: HttpException } = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      instance: new InternalServerErrorException(errorInstance),
    };

    if (exception instanceof HttpException) {
      responseObj.status = exception.getStatus();
      responseObj.instance = exception;
    } else {
      const err = wrapError(exception);

      if (err instanceof DBError) {
        switch (err.constructor) {
          case UniqueViolationError:
            errorInstance.message = 'Resource already exists';

            responseObj.status = HttpStatus.CONFLICT;
            responseObj.instance = new ConflictException(errorInstance);
            break;
          case ForeignKeyViolationError:
            errorInstance.message =
              'Conflict occured with depended resource(s)';

            responseObj.status = HttpStatus.NOT_FOUND;
            responseObj.instance = new NotFoundException(errorInstance);
            break;
          default:
            this.logger.error(
              'An error occured while querying to Database',
              err.nativeError,
            );

            break;
        }
      } else {
        this.logger.error(
          'An error occured while processing request',
          exception,
        );
      }
    }

    response.status(responseObj.status).json(responseObj.instance);
  }
}
