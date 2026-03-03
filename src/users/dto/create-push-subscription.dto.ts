import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreatePushSubscriptionDto {
  @ApiProperty({ description: 'Web Push subscription endpoint URL' })
  @IsString()
  @MinLength(1)
  endpoint: string;

  @ApiProperty({ description: 'Client public key (p256dh)' })
  @IsString()
  @MinLength(1)
  p256dh: string;

  @ApiProperty({ description: 'Auth secret' })
  @IsString()
  @MinLength(1)
  auth: string;
}
