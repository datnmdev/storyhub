import { HttpStatus } from '@nestjs/common';
import { HttpException } from './exception.define';

export class ForbiddenException extends HttpException {
  constructor() {
    super({
      statusCode: HttpStatus.FORBIDDEN,
      error: 'Forbidden',
      message: 'Forbidden',
    });
  }
}
