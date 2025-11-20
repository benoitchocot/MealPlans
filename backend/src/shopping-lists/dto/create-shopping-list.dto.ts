import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateShoppingListDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    mealPlanId?: string;
}
