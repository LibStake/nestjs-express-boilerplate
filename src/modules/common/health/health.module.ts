import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { HealthService } from './health.service';

import { HealthController } from './health.controller';

@Module({
    imports: [TerminusModule, HttpModule],
    providers: [HealthService],
    controllers: [HealthController],
})
export class HealthModule {}
