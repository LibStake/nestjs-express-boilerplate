import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

import { Observable } from 'rxjs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request } from 'express';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
    public constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
        @Inject(ConfigService)
        private readonly config: ConfigService,
    ) {}

    public intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request: Request = ctx.getRequest();

        const method = request.method;
        const url = this.httpAdapterHost.httpAdapter.getRequestUrl(request);
        const host =
            this.httpAdapterHost.httpAdapter.getRequestHostname(request);
        const body = JSON.stringify(request.body ?? '');
        this.logger.http(`${method} ${host} ${url} ${body}`);
        return next.handle();
    }
}
