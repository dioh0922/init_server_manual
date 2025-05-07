const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const knexConfig = require('./knexfile'); 

const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(knexConfig[environment]);
const app = express();

const hostname = '0.0.0.0';
const port = 4200;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'template'));

app.get('/init', async (req, res) => {
  try {
    const manuals = await knex('server_manual').select('*');
    res.render('init', {manuals});
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
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
  console.log('runnnin');
})
