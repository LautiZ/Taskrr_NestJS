import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ErrorManager } from 'src/utils/error.manager';
import { AuthDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() { username, password }: AuthDto) {
    try {
      const userValidated = await this.authService.validateUser(
        username,
        password,
      );

      if (!userValidated) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      const jwt = await this.authService.generateJWT(userValidated);

      return jwt;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
