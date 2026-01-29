import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';

import { UpdateEmailDto, UpdatePasswordDto, UpdateProfileDto, UserResponseDto } from './dto';
import { UsersService } from './users.service';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUserId() userId: string): Promise<UserResponseDto> {
    return this.usersService.getMe(userId);
  }

  @Patch('me/profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/email')
  @HttpCode(HttpStatus.OK)
  updateEmail(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateEmailDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateEmail(userId, dto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePassword(@CurrentUserId() userId: string, @Body() dto: UpdatePasswordDto): Promise<void> {
    return this.usersService.updatePassword(userId, dto);
  }
}
