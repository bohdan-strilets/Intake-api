import { CurrentSessionId } from '@app/common/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public, Refresh } from './decorators';
import {
  LoginDto,
  LoginResponseDto,
  RefreshDto,
  RefreshResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from './dto';
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

  @Public()
  @Refresh()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Body() dto: RefreshDto,
    @CurrentSessionId() sessionId: string,
  ): Promise<RefreshResponseDto> {
    return this.authService.refresh(sessionId, dto.refreshToken);
  }

  @Public()
  @Refresh()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() _dto: RefreshDto, @CurrentSessionId() sessionId: string): Promise<void> {
    return this.authService.logout(sessionId);
  }
}
