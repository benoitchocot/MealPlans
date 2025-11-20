import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateFromMealPlanDto {
    @IsString()
    @IsNotEmpty()
    mealPlanId: string;

    @IsString()
    @IsOptional()
    title?: string;
}
