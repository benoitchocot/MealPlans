import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('history')
@Controller('history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post('recipes/:recipeId/view')
    @ApiOperation({ summary: 'Record a recipe view' })
    @ApiResponse({ status: 201, description: 'Recipe view recorded successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    recordRecipeView(@Request() req: any, @Param('recipeId') recipeId: string) {
        return this.historyService.recordRecipeView(req.user.id, recipeId);
    }

    @Get()
    @ApiOperation({ summary: 'Get user history (meal plans, recent views, favorites, stats)' })
    @ApiResponse({ status: 200, description: 'History retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getHistory(@Request() req: any) {
        return this.historyService.getHistory(req.user.id);
    }

    @Post('recipes/:recipeId/favorite')
    @ApiOperation({ summary: 'Add a recipe to favorites' })
    @ApiResponse({ status: 201, description: 'Recipe added to favorites successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    addFavorite(@Request() req: any, @Param('recipeId') recipeId: string) {
        return this.historyService.addFavorite(req.user.id, recipeId);
    }

    @Delete('recipes/:recipeId/favorite')
    @ApiOperation({ summary: 'Remove a recipe from favorites' })
    @ApiResponse({ status: 200, description: 'Recipe removed from favorites successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    removeFavorite(@Request() req: any, @Param('recipeId') recipeId: string) {
        return this.historyService.removeFavorite(req.user.id, recipeId);
    }

    @Get('recipes/:recipeId/favorite')
    @ApiOperation({ summary: 'Check if a recipe is favorited' })
    @ApiResponse({ status: 200, description: 'Favorite status retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async isFavorite(@Request() req: any, @Param('recipeId') recipeId: string) {
        const isFav = await this.historyService.isFavorite(req.user.id, recipeId);
        return { isFavorite: isFav };
    }

    @Get('favorites')
    @ApiOperation({ summary: 'Get all favorite recipe IDs' })
    @ApiResponse({ status: 200, description: 'Favorite IDs retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getFavoriteIds(@Request() req: any) {
        const ids = await this.historyService.getFavoriteIds(req.user.id);
        return { favoriteIds: ids };
    }
}

