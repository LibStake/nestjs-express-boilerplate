import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

import { Request, Response } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationError } from 'class-validator';
import { instanceToPlain } from 'class-transformer';

import { ServerResponseType } from '../types/ServerResponse.type';

@Catch()
export class GeneralErrorHandler implements ExceptionFilter<unknown> {
    public constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly loggerService: Logger,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) {}

    public catch(exception: unknown & { code?: string }, host: ArgumentsHost) {
        const env: 'production' | 'development' =
            this.configService.get('server.env') ?? 'development';

        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const request: Request = ctx.getRequest();
        const response: Response = ctx.getResponse();

        const status: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : exception instanceof ValidationError
                  ? HttpStatus.BAD_REQUEST
                  : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorName: string =
            exception instanceof HttpException
                ? exception.name
                : exception.constructor.name || 'UnknownError';
        const description: string =
            exception instanceof HttpException
                ? exception.message
                : exception instanceof ValidationError
                  ? exception.toString()
                  : exception instanceof Error && env === 'development'
                    ? exception.message
                    : 'Unknown';

        const handledResponse: ServerResponseType<unknown> =
            new ServerResponseType<unknown>(
                status,
                undefined,
                errorName,
                description,
            );
        httpAdapter.reply(response, instanceToPlain(handledResponse), status);
    }
}
