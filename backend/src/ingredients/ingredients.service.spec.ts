import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from './ingredients.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { IngredientCategory, Unit } from '@prisma/client';

describe('IngredientsService', () => {
    let service: IngredientsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        ingredient: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IngredientsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<IngredientsService>(IngredientsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new ingredient', async () => {
            const createDto = {
                name: 'Tomato',
                category: IngredientCategory.FRESH,
                defaultUnit: Unit.PIECE,
            };

            const createdIngredient = {
                id: '1',
                name: 'tomato',
                category: IngredientCategory.FRESH,
                defaultUnit: Unit.PIECE,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaService.ingredient.findUnique.mockResolvedValue(null);
            mockPrismaService.ingredient.create.mockResolvedValue(createdIngredient);

            const result = await service.create(createDto);

            expect(result).toEqual(createdIngredient);
            expect(mockPrismaService.ingredient.findUnique).toHaveBeenCalledWith({
                where: { name: 'tomato' },
            });
            expect(mockPrismaService.ingredient.create).toHaveBeenCalled();
        });

        it('should throw ConflictException if ingredient already exists', async () => {
            const createDto = {
                name: 'Tomato',
                category: IngredientCategory.FRESH,
                defaultUnit: Unit.PIECE,
            };

            mockPrismaService.ingredient.findUnique.mockResolvedValue({ id: '1', name: 'tomato' });

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return all ingredients', async () => {
            const ingredients = [
                { id: '1', name: 'tomato', category: IngredientCategory.FRESH },
                { id: '2', name: 'onion', category: IngredientCategory.FRESH },
            ];

            mockPrismaService.ingredient.findMany.mockResolvedValue(ingredients);

            const result = await service.findAll();

            expect(result).toEqual(ingredients);
            expect(mockPrismaService.ingredient.findMany).toHaveBeenCalledWith({
                where: undefined,
                orderBy: { name: 'asc' },
            });
        });

        it('should filter by category', async () => {
            const ingredients = [{ id: '1', name: 'tomato', category: IngredientCategory.FRESH }];

            mockPrismaService.ingredient.findMany.mockResolvedValue(ingredients);

            const result = await service.findAll(IngredientCategory.FRESH);

            expect(result).toEqual(ingredients);
            expect(mockPrismaService.ingredient.findMany).toHaveBeenCalledWith({
                where: { category: IngredientCategory.FRESH },
                orderBy: { name: 'asc' },
            });
        });
    });

    describe('findOne', () => {
        it('should return an ingredient by id', async () => {
            const ingredient = { id: '1', name: 'tomato' };

            mockPrismaService.ingredient.findUnique.mockResolvedValue(ingredient);

            const result = await service.findOne('1');

            expect(result).toEqual(ingredient);
        });

        it('should throw NotFoundException if ingredient not found', async () => {
            mockPrismaService.ingredient.findUnique.mockResolvedValue(null);

            await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an ingredient', async () => {
            const existing = { id: '1', name: 'tomato' };
            const updated = { id: '1', name: 'cherry tomato' };

            mockPrismaService.ingredient.findUnique.mockResolvedValueOnce(existing);
            mockPrismaService.ingredient.findUnique.mockResolvedValueOnce(null);
            mockPrismaService.ingredient.update.mockResolvedValue(updated);

            const result = await service.update('1', { name: 'Cherry Tomato' });

            expect(result).toEqual(updated);
        });
    });

    describe('remove', () => {
        it('should delete an ingredient', async () => {
            const ingredient = { id: '1', name: 'tomato' };

            mockPrismaService.ingredient.findUnique.mockResolvedValue(ingredient);
            mockPrismaService.ingredient.delete.mockResolvedValue(ingredient);

            const result = await service.remove('1');

            expect(result).toEqual(ingredient);
            expect(mockPrismaService.ingredient.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });
});
