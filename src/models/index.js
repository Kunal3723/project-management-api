import { Sequelize } from "sequelize";
import databaseConfig from "../config/databaseConfig.js";

// export const sequelize = new Sequelize('postgres://avnadmin:AVNS_Ddnw4zi55LtJCjuj0Pv@pg-3e0b80aa-dtom7628-12a0.a.aivencloud.com:26911/defaultdb?sslmode=no-verify');
export const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
  host: databaseConfig.host,
  dialect: databaseConfig.dialect,
});
