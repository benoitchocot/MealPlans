import { IsInt, IsArray, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { DietType, Difficulty } from '@prisma/client';

export class UpdateUserSettingsDto {
    @IsInt()
    @Min(1)
    @Max(20)
    @IsOptional()
    householdSize?: number;

    @IsInt()
    @Min(1)
    @Max(21)
    @IsOptional()
    defaultMealsPerWeek?: number;

    @IsArray()
    @IsEnum(DietType, { each: true })
    @IsOptional()
    dietPreferences?: DietType[];

    @IsArray()
    @IsOptional()
    toolsAvailable?: string[];

    @IsEnum(Difficulty)
    @IsOptional()
    difficultyPreference?: Difficulty;

    @IsInt()
    @Min(5)
    @Max(240)
    @IsOptional()
    maxPrepTime?: number;
}
