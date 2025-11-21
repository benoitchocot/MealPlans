import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsInt,
    Min,
    IsArray,
    ValidateNested,
    IsOptional,
    IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DietType, Difficulty, Unit } from '@prisma/client';

class RecipeSubmissionIngredientDto {
    @IsString()
    @IsOptional()
    ingredientId?: string; // If ingredient exists in DB

    @IsString()
    @IsNotEmpty()
    ingredientName: string; // Name of ingredient (used if ingredientId is not provided)

    @IsInt()
    @Min(0)
    quantity: number;

    @IsEnum(Unit)
    unit: Unit;

    @IsOptional()
    optional?: boolean;
}

class RecipeSubmissionStepDto {
    @IsInt()
    @Min(1)
    stepNumber: number;

    @IsString()
    @IsNotEmpty()
    instruction: string;
}

export class SubmitRecipeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsInt()
    @Min(1)
    prepTime: number;

    @IsInt()
    @Min(0)
    cookTime: number;

    @IsEnum(Difficulty)
    difficulty: Difficulty;

    @IsInt()
    @Min(1)
    servings: number;

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsArray()
    @IsOptional()
    toolsRequired?: string[];

    @IsArray()
    @IsEnum(DietType, { each: true })
    @IsOptional()
    dietTypes?: DietType[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipeSubmissionIngredientDto)
    ingredients: RecipeSubmissionIngredientDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipeSubmissionStepDto)
    steps: RecipeSubmissionStepDto[];
}

export class ApproveRecipeDto {
    @IsString()
    @IsOptional()
    rejectionReason?: string; // Only used if rejecting
}

