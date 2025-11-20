import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientCategory } from '@prisma/client';

@Injectable()
export class IngredientsService {
    constructor(private prisma: PrismaService) { }

    async create(createIngredientDto: CreateIngredientDto) {
        // Check if ingredient with same name already exists
        const existing = await this.prisma.ingredient.findUnique({
            where: { name: createIngredientDto.name.toLowerCase() },
        });

        if (existing) {
            throw new ConflictException('Ingredient with this name already exists');
        }

        return this.prisma.ingredient.create({
            data: {
                name: createIngredientDto.name.toLowerCase(),
                category: createIngredientDto.category,
                defaultUnit: createIngredientDto.defaultUnit,
            },
        });
    }

    async createMany(ingredients: CreateIngredientDto[]) {
        // For seeding - skip duplicates
        const created = [];
        for (const ingredient of ingredients) {
            try {
                const result = await this.create(ingredient);
                created.push(result);
            } catch (error) {
                // Skip duplicates during bulk creation
                if (!(error instanceof ConflictException)) {
                    throw error;
                }
            }
        }
        return created;
    }

    async findAll(category?: IngredientCategory) {
        return this.prisma.ingredient.findMany({
            where: category ? { category } : undefined,
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const ingredient = await this.prisma.ingredient.findUnique({
            where: { id },
        });

        if (!ingredient) {
            throw new NotFoundException('Ingredient not found');
        }

        return ingredient;
    }

    async findByName(name: string) {
        return this.prisma.ingredient.findUnique({
            where: { name: name.toLowerCase() },
        });
    }

    async update(id: string, updateIngredientDto: UpdateIngredientDto) {
        await this.findOne(id); // Check if exists

        if (updateIngredientDto.name) {
            // Check if new name conflicts with another ingredient
            const existing = await this.prisma.ingredient.findUnique({
                where: { name: updateIngredientDto.name.toLowerCase() },
            });

            if (existing && existing.id !== id) {
                throw new ConflictException('Ingredient with this name already exists');
            }
        }

        return this.prisma.ingredient.update({
            where: { id },
            data: updateIngredientDto.name
                ? { ...updateIngredientDto, name: updateIngredientDto.name.toLowerCase() }
                : updateIngredientDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists

        return this.prisma.ingredient.delete({
            where: { id },
        });
    }
}
