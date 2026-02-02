import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateFoodFromAiDto } from './dto';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodService } from './food.service';

@Auth()
@ApiTags('Food')
@ApiBearerAuth('access-token')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add food manually' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async addFoodFromManual(
    @CurrentUserId() userId: string,
    @Body() dto: CreateFoodDto,
  ): Promise<void> {
    return this.foodService.addFoodFromManual(userId, dto);
  }

  @Delete(':foodId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete food entry' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async deleteFood(
    @Param('foodId') foodId: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    return this.foodService.delete(foodId, userId);
  }

  @Post('ai')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add food entries from AI parsing result' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async addFromAi(
    @CurrentUserId() userId: string,
    @Body() dto: CreateFoodFromAiDto,
  ): Promise<void> {
    return this.foodService.addFoodFromAi(userId, dto);
  }
}
