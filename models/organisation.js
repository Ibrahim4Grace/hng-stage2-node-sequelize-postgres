import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Organisation extends Model {}

Organisation.init(
  {
    orgId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Organisation',
    tableName: 'Organisations',
  }
);

export default Organisation;
