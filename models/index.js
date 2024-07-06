import User from './user.js';
import Organization from './organization.js';

// User model
User.belongsToMany(Organization, {
  through: 'UserOrganizations',
  as: 'organizations',
});
Organization.belongsToMany(User, { through: 'UserOrganizations', as: 'users' });

export { User, Organization };
