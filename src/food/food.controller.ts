import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import { AiRateLimit } from '@app/common/rate-limit/decorators';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AddFoodFromTextDto, UpdateFoodWeightDto } from './dto';
import { FoodService } from './food.service';

@Auth()
@ApiTags('Food')
@ApiBearerAuth('access-token')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

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

  @Patch(':foodId/weight')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update food weight' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async updateWeight(
    @Param('foodId') foodId: string,
    @CurrentUserId() userId: string,
    @Body() dto: UpdateFoodWeightDto,
  ): Promise<void> {
    return this.foodService.updateWeight(foodId, userId, dto.weight);
  }

  @Post('add/from-ai')
  @AiRateLimit()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add food to day from natural language text' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async addFromText(
    @CurrentUserId() userId: string,
    @Body() dto: AddFoodFromTextDto,
  ): Promise<void> {
    await this.foodService.addFromText(userId, dto);
  }
}
