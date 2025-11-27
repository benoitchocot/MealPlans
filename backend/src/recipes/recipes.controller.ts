import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeQueryDto } from './dto/recipe-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new recipe' })
    @ApiResponse({ status: 201, description: 'Recipe created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() createRecipeDto: CreateRecipeDto) {
        return this.recipesService.create(createRecipeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all recipes with optional filters' })
    @ApiResponse({ status: 200, description: 'Recipes retrieved successfully' })
    findAll(@Query() query: RecipeQueryDto) {
        return this.recipesService.findAll(query);
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.recipesService.findBySlug(slug);
    }

    // IMPORTANT: Routes spécifiques AVANT les routes génériques avec :id
    @Get(':id/nutrition')
    @ApiOperation({ summary: 'Calculate nutritional values for a recipe' })
    @ApiResponse({ status: 200, description: 'Nutritional values calculated successfully' })
    getNutritionalValues(@Param('id') id: string) {
        return this.recipesService.calculateNutritionalValues(id);
    }

    @Get(':id/servings/:servings')
    getWithAdjustedServings(@Param('id') id: string, @Param('servings') servings: string) {
        return this.recipesService.getRecipeWithAdjustedServings(id, parseInt(servings, 10));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.recipesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
        return this.recipesService.update(id, updateRecipeDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.recipesService.remove(id);
    }
}
