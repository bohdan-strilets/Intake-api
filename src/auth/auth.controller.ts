import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from './decorators';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './services';
import { LoginOutput, RegisterOutput } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<RegisterOutput> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginOutput> {
    return this.authService.login(dto);
  }
}
