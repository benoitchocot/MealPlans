import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUsersService = {
        findByEmail: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
            };

            const createdUser = {
                id: '1',
                email: registerDto.email,
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
                passwordHash: 'hashed',
            };

            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue(createdUser);
            mockJwtService.sign.mockReturnValue('jwt-token');

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('accessToken', 'jwt-token');
            expect(result.user).toEqual({
                id: createdUser.id,
                email: createdUser.email,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
            });
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
            expect(mockUsersService.create).toHaveBeenCalled();
        });

        it('should throw ConflictException if user already exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password123',
            };

            mockUsersService.findByEmail.mockResolvedValue({ id: '1', email: registerDto.email });

            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should successfully login a user', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const user = {
                id: '1',
                email: loginDto.email,
                passwordHash: await bcrypt.hash(loginDto.password, 10),
                firstName: 'John',
                lastName: 'Doe',
            };

            mockUsersService.findByEmail.mockResolvedValue(user);
            mockJwtService.sign.mockReturnValue('jwt-token');

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('accessToken', 'jwt-token');
            expect(result.user.email).toBe(loginDto.email);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            const loginDto = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            mockUsersService.findByEmail.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            const user = {
                id: '1',
                email: loginDto.email,
                passwordHash: await bcrypt.hash('correctpassword', 10),
            };

            mockUsersService.findByEmail.mockResolvedValue(user);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('validateUser', () => {
        it('should return user if found', async () => {
            const userId = '1';
            const user = { id: userId, email: 'test@example.com' };

            mockUsersService.findById.mockResolvedValue(user);

            const result = await service.validateUser(userId);

            expect(result).toEqual(user);
            expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
        });
    });
});
