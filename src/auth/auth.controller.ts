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

import { AuthService } from './auth.service';
import { Public, Refresh } from './decorators';
import {
  AuthResponseDto,
  AuthTokensResponseDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @AuthRateLimit()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({ description: 'User registered successfully', type: AuthResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @AuthRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Public()
  @Refresh()
  @Post('refresh')
  @RefreshRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  refresh(
    @Body() dto: RefreshTokenDto,
    @CurrentSessionId() sessionId: string,
  ): Promise<AuthTokensResponseDto> {
    return this.authService.refresh(sessionId, dto.refreshToken);
  }

  @Public()
  @Refresh()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiOkResponse({ description: 'Session terminated' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  logout(@Body() _dto: RefreshTokenDto, @CurrentSessionId() sessionId: string): Promise<void> {
    return this.authService.logout(sessionId);
  }

  @Public()
  @Post('restore')
  @ApiOperation({ summary: 'Restore deleted account' })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  restore(@Body() dto: LoginDto): Promise<AuthTokensResponseDto> {
    return this.authService.restoreAccount(dto);
  }
}
