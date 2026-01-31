import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import { CreateFoodFromAiDto } from './dto';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodService } from './food.service';

@Auth()
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('from-manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFoodFromManual(
    @CurrentUserId() userId: string,
    @Body() dto: CreateFoodDto,
  ): Promise<void> {
    return this.foodService.addFoodFromManual(userId, dto);
  }

  @Delete(':foodId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFood(
    @Param('foodId') foodId: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.foodService.delete(foodId, userId);
  }

  @Post('from-ai')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFromAi(
    @CurrentUserId() userId: string,
    @Body() dto: CreateFoodFromAiDto,
  ): Promise<void> {
    await this.foodService.addFoodFromAi(userId, dto);
  }
}
