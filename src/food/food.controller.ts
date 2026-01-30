import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import { CreateFoodDto } from './dto/create-food.dto';
import { FoodService } from './food.service';

@Auth()
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFood(@CurrentUserId() userId: string, @Body() dto: CreateFoodDto): Promise<void> {
    return this.foodService.addFood(userId, dto);
  }

  @Delete(':foodId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFood(
    @Param('foodId') foodId: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.foodService.delete(foodId, userId);
  }
}
