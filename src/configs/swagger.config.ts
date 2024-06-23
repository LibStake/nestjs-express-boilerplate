import { DocumentBuilder } from '@nestjs/swagger';

const documentConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Server API Document')
    .setDescription('The API document for the server application.')
    .setVersion('1.0.0')
    .build();
export default documentConfig;
