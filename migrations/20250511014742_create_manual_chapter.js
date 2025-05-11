/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('server_manual_chapter', (table) => {
    table.increments('chapter_id').primary();
    table.integer('batch_id').unsigned().notNullable().references('batch_id').inTable('server_manual_batch').onDelete('CASCADE');
    table.text('title').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('server_manual_chapter');
};
