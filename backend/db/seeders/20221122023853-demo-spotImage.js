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
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-22285259/original/a8013c81-e598-4708-8c2a-2692676a5717.jpeg?im_w=720',
        preview: true,
      },
      {
        spotId:2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-22285259/original/a8013c81-e598-4708-8c2a-2692676a5717.jpeg?im_w=720',
        preview: true
      },
      {
        spotId:3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-22285259/original/a8013c81-e598-4708-8c2a-2692676a5717.jpeg?im_w=720',
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
