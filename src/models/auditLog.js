import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import User from "./user.js";

const AuditLog = sequelize.define('AuditLog', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    {
      fields: ['user_id'] // Define indexing on the user_id column
    }
  ]
});

User.hasMany(AuditLog, { foreignKey: 'user_id' });

export default AuditLog;
