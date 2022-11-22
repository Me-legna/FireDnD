'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: 'This place was good!',
        stars: 4,
      },
      {
        spotId: 2,
        userId: 3,
        review: 'If this spot was a test, it passed!',
        stars: 5,
      },
      {
        spotId: 3,
        userId: 3,
        review: 'This place was straight cheeks!',
        stars: 2,
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});
  }
};
