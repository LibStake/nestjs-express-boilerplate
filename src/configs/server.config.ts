import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  envName: process.env.ENV_NAME || 'NO_NAME',
  env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  port: parseInt(process.env.SERVER_PORT ?? '3000', 10) || 3000,
}));
