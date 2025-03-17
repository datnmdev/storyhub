import { Body, Controller, Headers, Post } from '@nestjs/common';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-in/email-password')
  async loginWithEmailPassword(
    @Body() emailPasswordCredentialDto: EmailPasswordCredentialDto
  ) {
    return await this.userService.loginWithEmailPassword(
      emailPasswordCredentialDto
    );
  }

  @Post('validate-token')
  async validateToken(@Headers('Authorization') authorization: string) {
    return await this.userService.validateToken(authorization);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.userService.refreshToken(refreshTokenDto);
  }
}
