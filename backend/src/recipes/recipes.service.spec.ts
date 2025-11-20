import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Difficulty, DietType } from '@prisma/client';

describe('RecipesService', () => {
    let service: RecipesService;
    let prisma: PrismaService;

    const mockPrismaService = {
        recipe: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        recipeIngredient: {
            deleteMany: jest.fn(),
        },
        recipeStep: {
            deleteMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RecipesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<RecipesService>(RecipesService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generateSlug', () => {
        it('should generate a slug from title', () => {
            const slug = service['generateSlug']('Pâtes Carbonara');
            expect(slug).toBe('pates-carbonara');
        });

        it('should handle special characters', () => {
            const slug = service['generateSlug']('Crème Brûlée à l\'Orange');
            expect(slug).toBe('creme-brulee-a-l-orange');
        });
    });

    describe('create', () => {
        it('should create a new recipe', async () => {
            const createDto = {
                title: 'Test Recipe',
                prepTime: 10,
                cookTime: 20,
                difficulty: Difficulty.EASY,
                servings: 4,
                ingredients: [],
                steps: [],
            };

            const createdRecipe = {
                id: '1',
                slug: 'test-recipe',
                ...createDto,
            };

            mockPrismaService.recipe.findUnique.mockResolvedValue(null);
            mockPrismaService.recipe.create.mockResolvedValue(createdRecipe);

            const result = await service.create(createDto);

            expect(result).toEqual(createdRecipe);
            expect(mockPrismaService.recipe.findUnique).toHaveBeenCalledWith({
                where: { slug: 'test-recipe' },
            });
        });

        it('should throw ConflictException if recipe with same title exists', async () => {
            const createDto = {
                title: 'Existing Recipe',
                prepTime: 10,
                cookTime: 20,
                difficulty: Difficulty.EASY,
                servings: 4,
                ingredients: [],
                steps: [],
            };

            mockPrismaService.recipe.findUnique.mockResolvedValue({ id: '1' });

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return paginated recipes', async () => {
            const recipes = [
                { id: '1', title: 'Recipe 1' },
                { id: '2', title: 'Recipe 2' },
            ];

            mockPrismaService.recipe.findMany.mockResolvedValue(recipes);
            mockPrismaService.recipe.count.mockResolvedValue(2);

            const result = await service.findAll({});

            expect(result.data).toEqual(recipes);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(20);
        });

        it('should filter by diet types', async () => {
            const recipes = [{ id: '1', title: 'Vegetarian Recipe', dietTypes: [DietType.VEGETARIAN] }];

            mockPrismaService.recipe.findMany.mockResolvedValue(recipes);
            mockPrismaService.recipe.count.mockResolvedValue(1);

            const result = await service.findAll({ dietTypes: [DietType.VEGETARIAN] });

            expect(result.data).toEqual(recipes);
            expect(mockPrismaService.recipe.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        dietTypes: { hasEvery: [DietType.VEGETARIAN] },
                    }),
                }),
            );
        });

        it('should filter by difficulty', async () => {
            const recipes = [{ id: '1', title: 'Easy Recipe', difficulty: Difficulty.EASY }];

            mockPrismaService.recipe.findMany.mockResolvedValue(recipes);
            mockPrismaService.recipe.count.mockResolvedValue(1);

            const result = await service.findAll({ difficulty: Difficulty.EASY });

            expect(result.data).toEqual(recipes);
        });

        it('should filter by max prep time', async () => {
            const recipes = [{ id: '1', title: 'Quick Recipe', prepTime: 15 }];

            mockPrismaService.recipe.findMany.mockResolvedValue(recipes);
            mockPrismaService.recipe.count.mockResolvedValue(1);

            const result = await service.findAll({ maxPrepTime: 20 });

            expect(result.data).toEqual(recipes);
            expect(mockPrismaService.recipe.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        prepTime: { lte: 20 },
                    }),
                }),
            );
        });
    });

    describe('findOne', () => {
        it('should return a recipe by id', async () => {
            const recipe = { id: '1', title: 'Test Recipe' };

            mockPrismaService.recipe.findUnique.mockResolvedValue(recipe);

            const result = await service.findOne('1');

            expect(result).toEqual(recipe);
        });

        it('should throw NotFoundException if recipe not found', async () => {
            mockPrismaService.recipe.findUnique.mockResolvedValue(null);

            await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findBySlug', () => {
        it('should return a recipe by slug', async () => {
            const recipe = { id: '1', slug: 'test-recipe', title: 'Test Recipe' };

            mockPrismaService.recipe.findUnique.mockResolvedValue(recipe);

            const result = await service.findBySlug('test-recipe');

            expect(result).toEqual(recipe);
        });
    });

    describe('getRecipeWithAdjustedServings', () => {
        it('should adjust ingredient quantities based on servings', async () => {
            const recipe = {
                id: '1',
                servings: 4,
                ingredients: [
                    { quantity: 200, unit: 'G', ingredient: { name: 'flour' } },
                    { quantity: 100, unit: 'ML', ingredient: { name: 'milk' } },
                ],
            };

            mockPrismaService.recipe.findUnique.mockResolvedValue(recipe);

            const result = await service.getRecipeWithAdjustedServings('1', 8);

            expect(result.servings).toBe(8);
            expect(result.ingredients[0].quantity).toBe(400);
            expect(result.ingredients[1].quantity).toBe(200);
        });
    });
});
