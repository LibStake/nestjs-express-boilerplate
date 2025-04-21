import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston';

const winston = require('winston');
import 'winston-daily-rotate-file';


@Injectable()
export class LoggerConfigService implements WinstonModuleOptionsFactory {
    public constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) {}

    public createWinstonModuleOptions(): WinstonModuleOptions {
        const nodeEnv: 'production' | 'development' =
            this.configService.get('server.env') ?? 'development';
        const format = winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
                return `[Server] ${timestamp} [${level}] ${message}`;
            }),
            winston.format.splat(),
        );

        // Enable file logger
        const transports = [
            new winston.transports.DailyRotateFile({
                filename: 'logs/%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'debug',
                format: format,
            }),
        ];

        // Enable console logger in development mode
        if (nodeEnv !== 'production') {
            transports.push(
                new winston.transports.Console({
                    level: 'silly',
                    format: winston.format.combine(
                        winston.format.colorize(),
                        format,
                    ),
                }),
            );
        }

        // Combine options
        const option: WinstonModuleOptions = {
            level:
                this.configService.get('server.env') === 'production'
                    ? 'debug'
                    : 'http',
            format: format,
            transports: transports,
            exitOnError: false,
        };
        return option;
    }
}
