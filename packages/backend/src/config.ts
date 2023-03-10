import * as dotenv from 'dotenv';
import convict from 'convict';

dotenv.config();

const config = convict({
  PORT: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  DATABASE_URL: {
    doc: 'The database url.',
    env: 'DATABASE_URL',
    format: String,
    default: null,
  },
  JWT_SECRET: {
    doc: 'The JWT secret.',
    env: 'JWT_SECRET',
    format: String,
    default: '',
    sensitive: true,
  },
  NODE_ENV: {
    doc: 'The node environment.',
    env: 'NODE_ENV',
    format: ['production', 'development', 'test'],
    default: null,
  },
});

config.validate();

export default config;
