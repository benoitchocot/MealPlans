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
import { ShoppingListsService } from './shopping-lists.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { GenerateFromMealPlanDto } from './dto/generate-from-meal-plan.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
export class ShoppingListsController {
    constructor(private readonly shoppingListsService: ShoppingListsService) { }

    @Post()
    create(@Request() req: any, @Body() createShoppingListDto: CreateShoppingListDto) {
        return this.shoppingListsService.create(req.user.id, createShoppingListDto);
    }

    @Post('from-meal-plan')
    generateFromMealPlan(@Request() req: any, @Body() generateDto: GenerateFromMealPlanDto) {
        return this.shoppingListsService.generateFromMealPlan(req.user.id, generateDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.shoppingListsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.shoppingListsService.findOne(id, req.user.id);
    }

    @Get(':id/grouped')
    findOneGrouped(@Param('id') id: string, @Request() req: any) {
        return this.shoppingListsService.findOneGrouped(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Request() req: any, @Body() updateShoppingListDto: UpdateShoppingListDto) {
        return this.shoppingListsService.update(id, req.user.id, updateShoppingListDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.shoppingListsService.remove(id, req.user.id);
    }

    @Patch(':id/items/:itemId')
    updateItem(
        @Param('id') id: string,
        @Param('itemId') itemId: string,
        @Request() req: any,
        @Body() updateItemDto: UpdateItemDto,
    ) {
        return this.shoppingListsService.updateItem(id, itemId, req.user.id, updateItemDto);
    }

    @Delete(':id/items/:itemId')
    removeItem(@Param('id') id: string, @Param('itemId') itemId: string, @Request() req: any) {
        return this.shoppingListsService.removeItem(id, itemId, req.user.id);
    }
}
