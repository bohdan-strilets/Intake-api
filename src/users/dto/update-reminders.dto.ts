import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsIANATimeZone } from '../validators/iana-timezone.validator';

export class UpdateReminderChannelsDto {
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  email?: boolean;
}

export class UpdateRemindersDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ example: '20:00', description: 'HH:mm format' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'time must be HH:mm' })
  time?: string;

  @ApiPropertyOptional({ example: 'Europe/Warsaw' })
  @IsOptional()
  @IsString()
  @IsIANATimeZone()
  timezone?: string;

  @ApiPropertyOptional({ type: UpdateReminderChannelsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateReminderChannelsDto)
  channels?: UpdateReminderChannelsDto;
}
