import { Module } from '@nestjs/common';
import { MealPlansService } from './meal-plans.service';
import { MealPlansController } from './meal-plans.controller';
import { UsersModule } from '../users/users.module';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
    imports: [UsersModule, RecipesModule],
    controllers: [MealPlansController],
    providers: [MealPlansService],
    exports: [MealPlansService],
})
export class MealPlansModule { }
