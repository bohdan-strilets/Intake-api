import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UpdateEmailDto, UpdatePasswordDto, UpdateProfileDto, UserResponseDto } from './dto';
import { UsersService } from './users.service';

@Auth()
@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async getMe(@CurrentUserId() userId: string): Promise<UserResponseDto> {
    return this.usersService.getMe(userId);
  }

  @Patch('me/profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  updateProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user email' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  updateEmail(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateEmailDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateEmail(userId, dto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update current user password' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  updatePassword(@CurrentUserId() userId: string, @Body() dto: UpdatePasswordDto): Promise<void> {
    return this.usersService.updatePassword(userId, dto);
  }
}
