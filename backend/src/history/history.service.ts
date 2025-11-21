import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
    constructor(private prisma: PrismaService) { }

    async recordRecipeView(userId: string, recipeId: string) {
        // Check if view already exists today (to avoid duplicates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingView = await this.prisma.recipeView.findFirst({
            where: {
                userId,
                recipeId,
                viewedAt: {
                    gte: today,
                },
            },
        });

        if (existingView) {
            return existingView;
        }

        return this.prisma.recipeView.create({
            data: {
                userId,
                recipeId,
            },
        });
    }

    async getHistory(userId: string) {
        // Get recent meal plans (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [mealPlans, recentViews, favoriteRecipes, stats] = await Promise.all([
            // Recent meal plans
            this.prisma.mealPlan.findMany({
                where: {
                    userId,
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
                include: {
                    recipes: {
                        include: {
                            recipe: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true,
                                    prepTime: true,
                                    cookTime: true,
                                    difficulty: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 20,
            }),

            // Recent recipe views (last 30 days)
            this.prisma.recipeView.findMany({
                where: {
                    userId,
                    viewedAt: {
                        gte: thirtyDaysAgo,
                    },
                },
                include: {
                    recipe: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            prepTime: true,
                            cookTime: true,
                            difficulty: true,
                            imageUrl: true,
                        },
                    },
                },
                orderBy: {
                    viewedAt: 'desc',
                },
                take: 20,
            }),

            // Favorite recipes (explicit favorites)
            this.prisma.favorite.findMany({
                where: {
                    userId,
                },
                include: {
                    recipe: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            prepTime: true,
                            cookTime: true,
                            difficulty: true,
                            imageUrl: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 20,
            }),

            // Statistics
            Promise.all([
                this.prisma.mealPlan.count({
                    where: { userId },
                }),
                this.prisma.recipeView.count({
                    where: { userId },
                }),
                this.prisma.recipeView.groupBy({
                    by: ['recipeId'],
                    where: { userId },
                    _count: { recipeId: true },
                }).then(groups => groups.length),
            ]),
        ]);

        // Map favorites to include recipe details
        const favoritesWithDetails = favoriteRecipes.map(fav => ({
            ...fav.recipe,
            favoritedAt: fav.createdAt,
        }));

        return {
            mealPlans,
            recentViews: recentViews.map(view => ({
                ...view.recipe,
                viewedAt: view.viewedAt,
            })),
            favoriteRecipes: favoritesWithDetails,
            stats: {
                totalMealPlans: stats[0],
                totalRecipeViews: stats[1],
                uniqueRecipesViewed: stats[2],
            },
        };
    }

    async addFavorite(userId: string, recipeId: string) {
        // Check if already favorited
        const existing = await this.prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });

        if (existing) {
            return existing;
        }

        return this.prisma.favorite.create({
            data: {
                userId,
                recipeId,
            },
            include: {
                recipe: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        prepTime: true,
                        cookTime: true,
                        difficulty: true,
                        imageUrl: true,
                    },
                },
            },
        });
    }

    async removeFavorite(userId: string, recipeId: string) {
        return this.prisma.favorite.delete({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });
    }

    async isFavorite(userId: string, recipeId: string): Promise<boolean> {
        const favorite = await this.prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });
        return !!favorite;
    }

    async getFavoriteIds(userId: string): Promise<string[]> {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
            select: { recipeId: true },
        });
        return favorites.map(f => f.recipeId);
    }
}

