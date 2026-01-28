import { Auth, CurrentUserId } from '@app/auth/decorators';
import { Controller, Get } from '@nestjs/common';

import { UserProfileDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('me')
  async getMe(@CurrentUserId() userId: string): Promise<UserProfileDto> {
    return this.usersService.getMe(userId);
  }
}
