import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    private readonly maxRetries = 10;
    private readonly retryDelay = 2000; // 2 seconds

    async onModuleInit() {
        await this.connectWithRetry();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    private async connectWithRetry() {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                await this.$connect();
                this.logger.log('Successfully connected to the database');
                return;
            } catch (error) {
                this.logger.warn(
                    `Attempt ${attempt}/${this.maxRetries} to connect to database failed. Retrying in ${this.retryDelay}ms...`
                );
                
                if (attempt === this.maxRetries) {
                    this.logger.error('Failed to connect to database after all retries');
                    throw error;
                }
                
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
    }
}
