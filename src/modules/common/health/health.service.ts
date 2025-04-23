import { Inject, Injectable } from '@nestjs/common';
import {
    HealthCheckService,
    HttpHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class HealthService {
    public constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly loggerService: Logger,
        @Inject(HealthCheckService)
        private readonly healthCheckService: HealthCheckService,
        @Inject(HttpHealthIndicator)
        private readonly httpHealthIndicatorService: HttpHealthIndicator,
        @Inject(TypeOrmHealthIndicator)
        private readonly typeOrmHealthIndicatorService: TypeOrmHealthIndicator,
    ) {}

    public async healthCheck() {
        return await this.healthCheckService.check([
            this.checkInternetReachability.bind(this),
            this.checkDatabase.bind(this),
        ]);
    }

    private checkInternetReachability() {
        return this.httpHealthIndicatorService.pingCheck(
            'google',
            'https://google.com',
        );
    }

    private checkDatabase() {
        return this.typeOrmHealthIndicatorService.pingCheck('database');
    }
}
