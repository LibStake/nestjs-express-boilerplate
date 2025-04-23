import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('Health')
@Controller({
    path: '/health',
})
export class HealthController {
    public constructor(
        @Inject(HealthService)
        private readonly healthService: HealthService,
    ) {}

    @Get()
    @HealthCheck()
    public async healthCheck() {
        return await this.healthService.healthCheck();
    }

    @Get('/ping')
    @ApiResponse({ status: 200, description: 'Pong' })
    public async ping(): Promise<void> {
        return;
    }
}
