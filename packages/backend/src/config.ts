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
});

config.validate();

export default config;
