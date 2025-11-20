import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
    let service: UsersService;
    let prisma: PrismaService;

    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        userSettings: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new user with default settings', async () => {
            const userData = {
                email: 'test@example.com',
                passwordHash: 'hashed',
                firstName: 'John',
                lastName: 'Doe',
            };

            const createdUser = {
                id: '1',
                ...userData,
                settings: {
                    householdSize: 2,
                    defaultMealsPerWeek: 5,
                },
            };

            mockPrismaService.user.create.mockResolvedValue(createdUser);

            const result = await service.create(userData);

            expect(result).toEqual(createdUser);
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: {
                    ...userData,
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
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            const email = 'test@example.com';
            const user = { id: '1', email };

            mockPrismaService.user.findUnique.mockResolvedValue(user);

            const result = await service.findByEmail(email);

            expect(result).toEqual(user);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email },
                include: { settings: true },
            });
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            const userId = '1';
            const user = { id: userId, email: 'test@example.com' };

            mockPrismaService.user.findUnique.mockResolvedValue(user);

            const result = await service.findById(userId);

            expect(result).toEqual(user);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
                include: { settings: true },
            });
        });
    });

    describe('updateSettings', () => {
        it('should update existing settings', async () => {
            const userId = '1';
            const updateDto = { householdSize: 4 };
            const existingSettings = { id: '1', userId, householdSize: 2 };
            const updatedSettings = { ...existingSettings, ...updateDto };

            mockPrismaService.userSettings.findUnique.mockResolvedValue(existingSettings);
            mockPrismaService.userSettings.update.mockResolvedValue(updatedSettings);

            const result = await service.updateSettings(userId, updateDto);

            expect(result).toEqual(updatedSettings);
            expect(mockPrismaService.userSettings.update).toHaveBeenCalledWith({
                where: { userId },
                data: updateDto,
            });
        });

        it('should create settings if they do not exist', async () => {
            const userId = '1';
            const updateDto = { householdSize: 4 };
            const createdSettings = { id: '1', userId, ...updateDto };

            mockPrismaService.userSettings.findUnique.mockResolvedValue(null);
            mockPrismaService.userSettings.create.mockResolvedValue(createdSettings);

            const result = await service.updateSettings(userId, updateDto);

            expect(result).toEqual(createdSettings);
            expect(mockPrismaService.userSettings.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    ...updateDto,
                },
            });
        });
    });
});
