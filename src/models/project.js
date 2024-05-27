import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import User from "./user.js";

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Planned', 'In Progress', 'Completed'),
    defaultValue: 'Planned',
  },
  project_manager_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: [
    {
      fields: ['project_manager_id'] // Define indexing on the project_manager_id column
    },
    {
      fields: ['client_id'] // Define indexing on the client_id column
    }
  ]
});

User.hasMany(Project, { foreignKey: 'project_manager_id' });
User.hasMany(Project, { foreignKey: 'client_id' });

export default Project;
