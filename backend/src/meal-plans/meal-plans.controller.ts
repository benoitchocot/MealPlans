import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';
import { GenerateMealPlanDto } from './dto/generate-meal-plan.dto';
import { AddRecipeToPlanDto } from './dto/add-recipe-to-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlansController {
    constructor(private readonly mealPlansService: MealPlansService) { }

    @Post()
    create(@Request() req: any, @Body() createMealPlanDto: CreateMealPlanDto) {
        return this.mealPlansService.create(req.user.id, createMealPlanDto);
    }

    @Post('generate')
    generate(@Request() req: any, @Body() generateMealPlanDto: GenerateMealPlanDto) {
        return this.mealPlansService.generate(req.user.id, generateMealPlanDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.mealPlansService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.mealPlansService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Request() req: any, @Body() updateMealPlanDto: UpdateMealPlanDto) {
        return this.mealPlansService.update(id, req.user.id, updateMealPlanDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.mealPlansService.remove(id, req.user.id);
    }

    @Post(':id/recipes')
    addRecipe(@Param('id') id: string, @Request() req: any, @Body() addRecipeDto: AddRecipeToPlanDto) {
        return this.mealPlansService.addRecipe(id, req.user.id, addRecipeDto);
    }

    @Delete(':id/recipes/:recipeId')
    removeRecipe(@Param('id') id: string, @Param('recipeId') recipeId: string, @Request() req: any) {
        return this.mealPlansService.removeRecipe(id, recipeId, req.user.id);
    }
}
