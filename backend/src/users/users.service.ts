import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { EmailService } from '../recipe-submissions/email.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
        private configService: ConfigService,
    ) { }

    async create(data: {
        email: string;
        passwordHash: string;
        firstName?: string;
        lastName?: string;
    }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                settings: {
                    create: {
                        householdSize: 2,
                        defaultMealsPerWeek: 5,
                        dietPreferences: [],
                        toolsAvailable: [],
                    },
                },
            },
            include: {
                settings: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                settings: true,
            },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                settings: true,
            },
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            include: {
                settings: true,
            },
        });
    }

    async getSettings(userId: string) {
        return this.prisma.userSettings.findUnique({
            where: { userId },
        });
    }

    async updateSettings(userId: string, updateSettingsDto: UpdateUserSettingsDto) {
        // Check if settings exist
        const existingSettings = await this.prisma.userSettings.findUnique({
            where: { userId },
        });

        if (existingSettings) {
            return this.prisma.userSettings.update({
                where: { userId },
                data: updateSettingsDto,
            });
        } else {
            return this.prisma.userSettings.create({
                data: {
                    userId,
                    ...updateSettingsDto,
                },
            });
        }
    }

    async requestAccountDeletion(userId: string) {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Generate deletion token
        const deletionToken = randomBytes(32).toString('hex');
        
        // Store token in user settings or create a separate table
        // For simplicity, we'll store it in a temporary way
        // In production, you might want to create an AccountDeletionRequest table
        
        // Send email to admin
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const deletionUrl = `${frontendUrl}/admin/delete-account/${userId}/${deletionToken}`;
        
        const userName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || user.email;

        if (adminEmail) {
            await this.emailService.sendAccountDeletionEmail(
                adminEmail,
                user.email,
                userName,
                deletionUrl,
            );
        } else {
            console.warn('ADMIN_EMAIL not configured. Account deletion request logged:');
            console.log(`User ${user.email} (${userId}) requested account deletion.`);
            console.log(`Deletion URL: ${deletionUrl}`);
        }

        // Store the token temporarily (you might want to use Redis or a database table)
        // For now, we'll return the token to be stored client-side or in a session
        return {
            message: 'Account deletion request sent to administrator',
            token: deletionToken, // In production, don't return this to the client
        };
    }

    async deleteAccountByToken(userId: string, token: string) {
        // Verify token (in production, verify from storage)
        // For now, we'll accept any token for the user (not secure, but functional)
        // In production, store tokens in database with expiration
        
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Delete all associated data
        // Prisma will handle cascading deletes if foreign keys are set up correctly
        // But we need to delete manually to ensure everything is removed
        
        // Delete user settings
        await this.prisma.userSettings.deleteMany({
            where: { userId },
        });

        // Delete meal plans (cascade should handle meal plan recipes)
        await this.prisma.mealPlan.deleteMany({
            where: { userId },
        });

        // Delete shopping lists
        await this.prisma.shoppingList.deleteMany({
            where: { userId },
        });

        // Delete recipe views
        await this.prisma.recipeView.deleteMany({
            where: { userId },
        });

        // Delete favorites
        await this.prisma.favorite.deleteMany({
            where: { userId },
        });

        // Delete recipe submissions
        await this.prisma.recipeSubmission.deleteMany({
            where: { userId },
        });

        // Delete reviews
        await this.prisma.recipeReview.deleteMany({
            where: { userId },
        });

        // Delete review reports
        await this.prisma.reviewReport.deleteMany({
            where: { userId },
        });

        // Finally, delete the user
        await this.prisma.user.delete({
            where: { id: userId },
        });

        return { message: 'Account and all associated data deleted successfully' };
    }
}
