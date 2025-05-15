const path = require('path');
const knexConfig = require(path.join(__dirname, '..', 'knexfile')); 

const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(knexConfig[environment]);

async function initManualBatch(){
  const manulaTemplate = require(path.join(__dirname, '..', 'manual.json'));
  const batch_id = await insertBatch();
  for (const key in manulaTemplate) {
    const chapter_id = await insertChapter(batch_id, key);
    manulaTemplate[key].forEach(element => {
      const { step, command, description } = element;
      const actualCommand = command ?? description;
      insertStep(chapter_id, {step: step, command: actualCommand, description: description});
    });
  }
}

async function insertBatch(){
  const [batch_id] = await knex('server_manual_batch').insert({});
  return batch_id;
}

async function insertChapter(batch_id, key){
  const [chapter_id] = await knex('server_manual_chapter').insert({batch_id: batch_id, title: key});
  return chapter_id;
}

async function insertStep(chapter_id, step){
  const [step_id] = await knex('server_manual_step')
    .insert({
      chapter_id: chapter_id,
      step_number: step.step,
      command: step.command,
      description: step.description
    });
  return step_id;
}

async function fetchAllBatch(){
  return await knex('server_manual_batch').select('*');
}

async function fetchBatchDetail(id){
  return await knex('server_manual_step')
    .join('server_manual_chapter', 'server_manual_step.chapter_id', '=', 'server_manual_chapter.chapter_id')
    .select('*')
    .where('batch_id', parseInt(id));
}

module.exports = {
  initManualBatch,
  fetchAllBatch,
  fetchBatchDetail,
};