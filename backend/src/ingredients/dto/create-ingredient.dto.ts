import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { IngredientCategory, Unit } from '@prisma/client';

export class CreateIngredientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(IngredientCategory)
    category: IngredientCategory;

    @IsEnum(Unit)
    defaultUnit: Unit;
}
