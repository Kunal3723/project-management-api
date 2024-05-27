import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import bcrypt from 'bcryptjs'

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('SuperAdmin', 'Admin', 'Client'),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  secret: {
    type: DataTypes.STRING
  },
  emailVerificationToken: {
    type: DataTypes.STRING
  },
  emailId: {
    type: DataTypes.STRING
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
  indexes: [
    {
      unique: true,
      fields: ['username'] // Define indexing on the username column
    }
  ]
});

export default User;
