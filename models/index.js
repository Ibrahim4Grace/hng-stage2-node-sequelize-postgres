import User from './user.js';
import Organization from './organization.js';
import { sequelize } from '../config/db.js';

const UserOrganizations = sequelize.define(
  'UserOrganizations',
  {},
  { timestamps: false }
);

User.belongsToMany(Organization, {
  through: UserOrganizations,
  as: 'organizations',
});
Organization.belongsToMany(User, { through: UserOrganizations, as: 'users' });

export { User, Organization, UserOrganizations, sequelize };
