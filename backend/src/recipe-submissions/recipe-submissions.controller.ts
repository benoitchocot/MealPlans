import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecipeSubmissionsService } from './recipe-submissions.service';
import { SubmitRecipeDto, ApproveRecipeDto } from './dto/submit-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('recipe-submissions')
@Controller('recipe-submissions')
export class RecipeSubmissionsController {
    constructor(private readonly submissionsService: RecipeSubmissionsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Submit a recipe for approval' })
    @ApiResponse({ status: 201, description: 'Recipe submitted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async submit(@Request() req: any, @Body() submitDto: SubmitRecipeDto) {
        return this.submissionsService.submit(req.user.id, submitDto);
    }

    @Get('approve/:token')
    @ApiOperation({ summary: 'Get recipe submission by approval token' })
    @ApiResponse({ status: 200, description: 'Recipe submission found' })
    @ApiResponse({ status: 404, description: 'Recipe submission not found' })
    async getByToken(@Param('token') token: string) {
        return this.submissionsService.findByToken(token);
    }

    @Get('approve/:token/nutrition')
    @ApiOperation({ summary: 'Calculate nutritional values for a recipe submission' })
    @ApiResponse({ status: 200, description: 'Nutritional values calculated successfully' })
    async getNutritionalValues(@Param('token') token: string) {
        return this.submissionsService.calculateNutritionalValues(token);
    }

    @Patch('approve/:token/approve')
    @ApiOperation({ summary: 'Approve a recipe submission' })
    @ApiResponse({ status: 200, description: 'Recipe approved and created' })
    @ApiResponse({ status: 404, description: 'Recipe submission not found' })
    @ApiResponse({ status: 400, description: 'Submission already reviewed' })
    async approve(@Param('token') token: string) {
        return this.submissionsService.approve(token);
    }

    @Patch('approve/:token/reject')
    @ApiOperation({ summary: 'Reject a recipe submission' })
    @ApiResponse({ status: 200, description: 'Recipe submission rejected' })
    @ApiResponse({ status: 404, description: 'Recipe submission not found' })
    @ApiResponse({ status: 400, description: 'Submission already reviewed' })
    async reject(@Param('token') token: string, @Body() rejectDto: ApproveRecipeDto) {
        return this.submissionsService.reject(token, rejectDto.rejectionReason);
    }
}

