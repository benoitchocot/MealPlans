import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getCurrentUser(@Request() req: any) {
        return {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
        };
    }

    @Patch('me')
    async updateCurrentUser(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(req.user.id, updateUserDto);
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    @Get('me/settings')
    async getSettings(@Request() req: any) {
        return this.usersService.getSettings(req.user.id);
    }

    @Patch('me/settings')
    async updateSettings(@Request() req: any, @Body() updateSettingsDto: UpdateUserSettingsDto) {
        return this.usersService.updateSettings(req.user.id, updateSettingsDto);
    }
}
