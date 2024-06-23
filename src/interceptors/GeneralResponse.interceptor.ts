import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

import { Observable, map } from 'rxjs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';

import { ServerResponseType } from '../types/ServerResponse.type';

import { instanceToPlain } from 'class-transformer';

@Injectable()
export class GeneralResponseInterceptor implements NestInterceptor {
    public constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly loggerService: Logger,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) {}

    public intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        return next
            .handle()
            .pipe(map((data: unknown) => this.handleResponse(data, context)));
    }

    public handleResponse(data: unknown, context: ExecutionContext) {
        const env: 'production' | 'development' =
            this.configService.get('server.env');

        const ctx = context.switchToHttp();
        const request: Request = ctx.getRequest();
        const response: Response = ctx.getResponse();

        const status = response.statusCode;

        const handledResponse: ServerResponseType<typeof data> =
            new ServerResponseType(status, data);
        return instanceToPlain(handledResponse);
    }
}
