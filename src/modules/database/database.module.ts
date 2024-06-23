import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { DatabaseConfigService } from './databaseConfig.service';

export const DatabaseModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useClass: DatabaseConfigService,
});
