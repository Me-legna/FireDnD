'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: 'Test Address',
        city: 'Test City',
        state: 'AL',
        country: 'Test Country',
        lat: 123.12312,
        lng: 12.123123,
        name: 'Test Name',
        description: 'Test Description',
        price: 123,
      },
      {
        ownerId: 1,
        address: 'Testing Address',
        city: 'Testing City',
        state: 'LA',
        country: 'Testing Country',
        lat: 321.32121,
        lng: 21.321321,
        name: 'Testing Name',
        description: 'Testing Description',
        price: 321,
      },
      {
        ownerId: 2,
        address: 'Fake Address',
        city: 'Fake City',
        state: 'NJ',
        country: 'Fake Country',
        lat: 545.454545,
        lng: 45.454545,
        name: 'Fake Name',
        description: 'Fake Description',
        price: 456,
      },
    ], {});

  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Test Name', 'Testing Name', 'Fake Name',] }
    }, {});
  }
};
