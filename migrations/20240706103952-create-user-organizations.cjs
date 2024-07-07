'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Applying migration: create-user-organisations');
    await queryInterface.createTable('UserOrganisations', {
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      orgId: {
        type: Sequelize.STRING,
        references: {
          model: 'Organisations',
          key: 'orgId',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserOrganisations');
  },
};
