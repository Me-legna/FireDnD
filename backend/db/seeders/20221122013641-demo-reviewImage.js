'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      {
        reviewId:1,
        url: 'img1spotId1.url'
      },
      {
        reviewId:2,
        url: 'img1spotId2.url'
      },
      {
        reviewId:3,
        url: 'img1spotId3.url'
      },
    ],{})

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      id: { [Op.in]: [1,2,3] }
    }, {})
  }
};
