import dotenv from 'dotenv';
dotenv.config();

const databaseConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
}

export default databaseConfig;