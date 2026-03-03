import { Auth } from '@app/auth/decorators';
import { CurrentUserId } from '@app/common/decorators';
import { ErrorResponseDto } from '@app/common/errors/dto';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PromptIdParamDto, RecentQueryDto, SavedPromptResponseDto } from './dto';
import { SavedPromptsService } from './saved-prompts.service';

@Auth()
@ApiTags('Saved prompts')
@ApiBearerAuth('access-token')
@Controller('prompts')
export class SavedPromptsController {
  constructor(private readonly service: SavedPromptsService) {}

  @Get('recent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get recent prompts (last used)' })
  @ApiOkResponse({ type: [SavedPromptResponseDto] })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getRecent(
    @CurrentUserId() userId: string,
    @Query() query: RecentQueryDto,
  ): Promise<SavedPromptResponseDto[]> {
    const limit = query.limit ?? 10;
    return this.service.getRecent(userId, limit);
  }

  @Get('favorites')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get favorite prompts' })
  @ApiOkResponse({ type: [SavedPromptResponseDto] })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getFavorites(@CurrentUserId() userId: string): Promise<SavedPromptResponseDto[]> {
    return this.service.getFavorites(userId);
  }

  @Patch(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle prompt favorite' })
  @ApiOkResponse({ type: SavedPromptResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  toggleFavorite(
    @Param() params: PromptIdParamDto,
    @CurrentUserId() userId: string,
  ): Promise<SavedPromptResponseDto> {
    return this.service.toggleFavorite(params.id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete saved prompt' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async delete(
    @Param() params: PromptIdParamDto,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.service.delete(params.id, userId);
  }
}
