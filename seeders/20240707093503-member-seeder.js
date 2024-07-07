'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const payloads = [
      {
        code: "M001",
        name: "Angga",
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      },
      {
        code: "M002",
        name: "Ferry",
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      },
      {
        code: "M003",
        name: "Putri",
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      },
    ]

    await queryInterface.bulkInsert('Members', payloads, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
