import {Sequelize, DataType} from 'sequelize-typescript';

import Plugin from "./models/plugin";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.STORAGE || './database.sqlite3'
});

sequelize.addModels([Plugin]);

Plugin.init({
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: {
    type: DataType.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataType.DATE,
    allowNull: false,
  },
  name: {
    type: DataType.STRING,
    allowNull: false,
  },
  description: {
    type: DataType.STRING,
    allowNull: false,
  },
  status: {
    type: DataType.STRING,
    allowNull: false,
  },
  metadata: {
    type: DataType.JSON,
    allowNull: true,
  },
  contract: {
    type: DataType.JSON,
    allowNull: true,
  },
  contractAddress: {
    type: DataType.STRING,
    allowNull: true,
  },
  contractAbi: {
    type: DataType.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'plugins'
})


export default sequelize;
