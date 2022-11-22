'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId:1,
        url: 'spotId1.url',
        preview: true,
      },
      {
        spotId:2,
        url: 'spotId2.url',
        preview: true
      },
      {
        spotId:3,
        url: 'spotId3.url',
        preview: true
      },
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      id: { [Op.in]: [1,2,3] }
    }, {})
  }
};
