import { ActivityLevel, Goal, Sex } from '@app/users/enums';
import { ApiProperty } from '@nestjs/swagger';

import { MetabolismDto } from './metabolism.dto';

export class UserResponseDto {
  @ApiProperty({ example: '65f0c1b2a3e4f56789012345' })
  id: string;

  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ enum: Sex, example: Sex.Male })
  sex: Sex;

  @ApiProperty({ example: '1990-01-01' })
  dateOfBirth: string;

  @ApiProperty({ example: 30 })
  age: number;

  @ApiProperty({ example: 175 })
  height: number;

  @ApiProperty({ example: 70 })
  weight: number;

  @ApiProperty({ example: 60 })
  targetWeight?: number;

  @ApiProperty({ enum: Goal, example: Goal.Lose })
  goal: Goal;

  @ApiProperty({ example: 5 })
  goalDelta?: number;

  @ApiProperty({ enum: ActivityLevel, example: ActivityLevel.MODERATE })
  activityLevel: ActivityLevel;

  @ApiProperty({ type: MetabolismDto })
  metabolism: MetabolismDto;
}
