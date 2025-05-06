/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('server_manual').del()
  await knex('server_manual').insert([
    {id: 1, summary: 'rowValue1'},
    {id: 2, summary: 'rowValue2'}
  ]);
};
