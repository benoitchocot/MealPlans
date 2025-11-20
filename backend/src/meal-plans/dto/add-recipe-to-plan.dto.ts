import { IsString, IsNotEmpty, IsInt, Min, IsDateString, IsOptional } from 'class-validator';

export class AddRecipeToPlanDto {
    @IsString()
    @IsNotEmpty()
    recipeId: string;

    @IsInt()
    @Min(1)
    servings: number;

    @IsDateString()
    @IsOptional()
    plannedFor?: string;
}
