import { DocumentBuilder } from '@nestjs/swagger';

import { getServerVersion } from '../utils/version';

const documentConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Server API Document')
    .setDescription('The API document for the server application.')
    .setVersion(getServerVersion())
    .build();
export default documentConfig;
