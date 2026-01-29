import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

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
}
