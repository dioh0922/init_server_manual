/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('server_manual_step', function(table) {
    table.increments('step_id').primary();
    table.integer('chapter_id').unsigned().notNullable().references('chapter_id').inTable('server_manual_chapter').onDelete('CASCADE');
    table.integer('step_number').notNullable();
    table.text('command').notNullable();
    table.text('description').nullable();
    table.boolean('is_delete').notNullable().defaultTo(false);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('server_manual_step');
};
