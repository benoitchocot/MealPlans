import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

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
}
