// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// export default {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('UserOrganizations', {
//       userId: {
//         type: Sequelize.STRING,
//         references: {
//           model: 'Users',
//           key: 'userId',
//         },
//         onDelete: 'CASCADE',
//         allowNull: false,
//       },
//       orgId: {
//         type: Sequelize.STRING,
//         references: {
//           model: 'Organizations',
//           key: 'orgId',
//         },
//         onDelete: 'CASCADE',
//         allowNull: false,
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW,
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW,
//       },
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('UserOrganizations');
//   },
// };

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserOrganizations', {
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
          model: 'Organizations',
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
    await queryInterface.dropTable('UserOrganizations');
  },
};
