import { Auth, CurrentUserId } from '@app/auth/decorators';
import { Body, Controller, Get, Patch } from '@nestjs/common';

import { UpdateEmailDto, UpdateProfileDto, UserResponseDto } from './dto';
import { UsersService } from './users.service';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUserId() userId: string): Promise<UserResponseDto> {
    return this.usersService.getMe(userId);
  }

  @Patch('me/profile')
  updateProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/email')
  updateEmail(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateEmailDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateEmail(userId, dto);
  }
}
