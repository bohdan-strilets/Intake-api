import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReminderChannelsDto {
  @ApiProperty({ example: false })
  push: boolean;

  @ApiProperty({ example: false })
  email: boolean;
}

export class RemindersDto {
  @ApiProperty({ example: false })
  enabled: boolean;

  @ApiProperty({ example: '20:00' })
  time: string;

  @ApiProperty({ example: 'Europe/Warsaw' })
  timezone: string;

  @ApiProperty({ type: ReminderChannelsDto })
  channels: ReminderChannelsDto;

  @ApiPropertyOptional({ nullable: true })
  lastSentAt?: string | null;
}
