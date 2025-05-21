const path = require('path');
const knexConfig = require(path.join(__dirname, '..', 'knexfile')); 
const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(knexConfig[environment]);
const axios = require('axios');

async function initManualBatch(){
  const manualUrl = process.env.TEMPLATE_URL;
  const manulaTemplate = (await axios.get(manualUrl)).data;
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
  const list = await knex('server_manual_step')
    .join('server_manual_chapter', 'server_manual_step.chapter_id', '=', 'server_manual_chapter.chapter_id')
    .select('*')
    .where('batch_id', parseInt(id))
    .orderBy('server_manual_step.step_id');
  const group = list.reduce((acc, data) => {
    let filteredGroup = acc.find(item => item.title === data.title);
    if(!filteredGroup){
      filteredGroup = {title: data.title, id:data.chapter_id, steps:[]};
      // 格納用配列にないキーを初期化
      acc.push(filteredGroup);
    }
    filteredGroup.steps.push(data);
    return acc;
  }, []);
  return group;
}

async function deleteStep(id){
  const result = await knex('server_manual_step')
    .where('step_id', parseInt(id))
    .update({
      is_delete: 1
    });
    return result;
}

module.exports = {
  initManualBatch,
  fetchAllBatch,
  fetchBatchDetail,
  deleteStep,
};