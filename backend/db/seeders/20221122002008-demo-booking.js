'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: '2024-11-24',
        endDate: '2024-11-25',
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2023-12-24',
        endDate: '2023-12-25',
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2025-10-24',
        endDate: '2025-10-25',
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {})
  }
};
