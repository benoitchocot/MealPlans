import { Module } from '@nestjs/common';
import { ShoppingListsService } from './shopping-lists.service';
import { ShoppingListsController } from './shopping-lists.controller';
import { MealPlansModule } from '../meal-plans/meal-plans.module';

@Module({
    imports: [MealPlansModule],
    controllers: [ShoppingListsController],
    providers: [ShoppingListsService],
    exports: [ShoppingListsService],
})
export class ShoppingListsModule { }
