import User from './user.js';
import Organisation from './organisation.js';
import { sequelize } from '../config/db.js';

const UserOrganisations = sequelize.define(
  'UserOrganisations',
  {},
  { timestamps: false }
);

User.belongsToMany(Organisation, {
  through: UserOrganisations,
  as: 'organisations',
});
Organisation.belongsToMany(User, { through: UserOrganisations, as: 'users' });

export { User, Organisation, UserOrganisations, sequelize };
