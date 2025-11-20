import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsInt, Min } from 'class-validator';

export class CreateMealPlanDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsArray()
    @IsOptional()
    recipeIds?: string[];
}
