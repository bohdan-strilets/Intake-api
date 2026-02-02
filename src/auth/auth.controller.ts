import { CurrentSessionId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { AuthRateLimit, RefreshRateLimit } from '@app/common/rate-limit/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @AuthRateLimit()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Public()
  @Refresh()
  @Post('refresh')
  @RefreshRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: RefreshResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
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
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  logout(@Body() _dto: RefreshDto, @CurrentSessionId() sessionId: string): Promise<void> {
    return this.authService.logout(sessionId);
  }
}
