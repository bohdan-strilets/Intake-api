import { CurrentSessionId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { AuthRateLimit, RefreshRateLimit } from '@app/common/rate-limit/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Public()
  @Refresh()
  @Post('refresh')
  @RefreshRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
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
  @ApiOkResponse({ description: 'Session terminated' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  logout(@Body() _dto: RefreshDto, @CurrentSessionId() sessionId: string): Promise<void> {
    return this.authService.logout(sessionId);
  }
}
