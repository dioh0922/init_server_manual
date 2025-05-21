const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const dbClient = require('./module/knexClient');

const hostname = '0.0.0.0';
const port = 4200;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'template'));

app.get('/init', async (req, res) => {
  try {
    await dbClient.initManualBatch();
    res.redirect('./list');
  } catch (err) {
    console.error(err);
    res.status(500).send('init error');
  }
});

app.get('/list', async (req, res) => {
  try {
    const manuals = await dbClient.fetchAllBatch();
    res.render('list', {manuals});
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.get('/detail/:id', async (req, res) => {
  const id = req.params.id;
  try{
    const steps = await dbClient.fetchBatchDetail(id);
    res.render('detail', {steps});
  }catch(err){
    console.error(err);
    res.status(500).send('detail error');
  }
});

app.delete('/api/delete/:id', async(req, res) => {
  try{
    const id = req.params.id;
    const result = await dbClient.deleteStep(id);
    res.status(200).send(result);
  }catch(err){
    console.log(err);
    res.status(500).send('delete error');
  }
});

app.get('/', async (req, res) => {
  try {
    res.render('index', { });
  } catch (err) {
    console.error(err);
    res.status(404).send('File Not Found');
  }
});

/*
TODO:
app.all('*', (req, res) => {
  res.redirect('/');
});
*/

app.listen(port, hostname, () => {
  console.log('server start');
})
