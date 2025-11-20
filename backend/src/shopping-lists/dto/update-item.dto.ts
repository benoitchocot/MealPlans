import { IsBoolean, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateItemDto {
    @IsBoolean()
    @IsOptional()
    checked?: boolean;

    @IsInt()
    @Min(0)
    @IsOptional()
    quantity?: number;
}
