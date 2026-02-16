import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
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

  @Put('me/email')
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

  @Put('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update current user password' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  updatePassword(@CurrentUserId() userId: string, @Body() dto: UpdatePasswordDto): Promise<void> {
    return this.usersService.updatePassword(userId, dto);
  }

  @Delete('me/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete current user' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  deleteUser(@CurrentUserId() userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }
}
