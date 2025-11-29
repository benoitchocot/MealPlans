import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailService } from '../recipe-submissions/email.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [UsersService, EmailService, ConfigService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }
