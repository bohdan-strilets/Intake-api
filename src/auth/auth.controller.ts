import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from './decorators';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from './dto';
import { AuthService } from './services';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
