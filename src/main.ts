import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { AppModule } from "./modules/app.module";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule } from "@nestjs/swagger";

import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from "nest-winston";
import compression from 'compression';

import documentConfig from "./configs/swagger.config";
import { RequestLoggerInterceptor } from "./interceptors/RequestLogger.interceptor";
import { GeneralResponseInterceptor } from "./interceptors/GeneralResponse.interceptor";
import { GeneralErrorHandler } from "./filters/GeneralErrorHandler.filter";

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });

    const httpAdapterHost = app.get(HttpAdapterHost)
    
    // Get services
    const configService = app.get(ConfigService);
    const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);

    // Enable logger
    app.useLogger(loggerService);

    // Enable GZIP compression
    app.use(compression());

    // CORS
    app.enableCors({
        origin: '*',
        // Allow expose sepcific HTTP headers
        exposedHeaders: [],
    });

    // Enable versioning
    app.enableVersioning({
        // Enable scheme {PROTOCOL}://{HOST}/{VERSION}/{PATH}
        // VERSION : v1, v2, v3, ...
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    

    // Enable validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            // Forbid non-whitelisted properties -- if need loosely coupled versioning, set to false
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            disableErrorMessages: configService.get('server.env') === 'production',
        })
    );

    // Enable interceptors
    app.useGlobalInterceptors(
        // Log request
        new RequestLoggerInterceptor(httpAdapterHost, app.get(WINSTON_MODULE_PROVIDER), configService),
        // Convert response data to standard format
        new GeneralResponseInterceptor(httpAdapterHost, app.get(WINSTON_MODULE_PROVIDER), configService),
    );

    // Enable filters
    app.useGlobalFilters(
        // Convert Error to standard format
        new GeneralErrorHandler(httpAdapterHost, app.get(WINSTON_MODULE_PROVIDER), configService),
    );

    // Enable Swagger
    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, documentConfig));

    // Run NestJS server
    await app.listen(configService.get('server.port'), '0.0.0.0', () => {
        loggerService.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
        loggerService.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Running NestJS Server =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
        loggerService.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
        loggerService.log(`Environment Name: ${configService.get('server.envName')}`);
        loggerService.log(`     Environment: ${configService.get('server.env')}`);
        loggerService.log(`  Listening port: ${configService.get('server.port')}`);
        loggerService.log(`=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
    });
}

void bootstrap();
