import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { RegisterDto } from './dto';
import { AuthService } from './services';
import { RegisterOutput } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<RegisterOutput> {
    return this.authService.register(dto);
  }
}
