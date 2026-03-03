import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
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

import {
  CreatePushSubscriptionDto,
  GoalProgressDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateRemindersDto,
  UpdateUserSettingsDto,
  UserResponseDto,
} from './dto';
import { GoalProgressService } from './services';
import { UsersService } from './users.service';

@Auth()
@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly goalProgressService: GoalProgressService,
  ) {}

  @Get('goal-progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get goal progress (weight, progress %, rate, ETA)' })
  @ApiOkResponse({ type: GoalProgressDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getGoalProgress(@CurrentUserId() userId: string): Promise<GoalProgressDto> {
    return this.goalProgressService.getGoalProgress(userId);
  }

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

  @Patch('me/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user settings' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  updateSettings(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateUserSettingsDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateSettings(userId, dto);
  }

  @Patch('reminders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update reminder settings' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  updateReminders(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateRemindersDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateReminders(userId, dto);
  }

  @Post('push-subscription')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register push subscription' })
  @ApiOkResponse({ description: 'Returns created subscription id' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  createPushSubscription(
    @CurrentUserId() userId: string,
    @Body() dto: CreatePushSubscriptionDto,
  ): Promise<{ id: string }> {
    return this.usersService.createPushSubscription(userId, dto);
  }

  @Delete('push-subscription/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  deletePushSubscription(
    @CurrentUserId() userId: string,
    @Param('id') subscriptionId: string,
  ): Promise<void> {
    return this.usersService.deletePushSubscription(subscriptionId, userId);
  }
}
