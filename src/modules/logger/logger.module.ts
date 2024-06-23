import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WinstonModule } from 'nest-winston';

import { LoggerConfigService } from './loggerConfig.service';

@Global()
@Module({
    imports: [
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            useClass: LoggerConfigService,
        }),
    ],
})
export class LoggerModule {}
