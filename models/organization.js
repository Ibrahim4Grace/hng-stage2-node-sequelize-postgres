import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Organization extends Model {}

Organization.init(
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
    modelName: 'Organization',
    tableName: 'Organizations',
  }
);

export default Organization;
