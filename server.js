'use strict';
const express = require('express');
const { PORT } = require('./config');
const logger = require('./middleware/logger');



// Load array of notes
const data = require('./db/notes');

const app = express(); 
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

app.use(logger);
app.get('/api/notes', (req, res) => {
  const query = req.query;
  let list = data;

  if(query.searchTerm) {
    list = list.filter(note => note.title.includes(query.searchTerm));
  }
  res.json(list);
});

app.get('/api/notes/:id', (req, res) => {
  let id = req.params.id;
  let note = data.find(note => note.id === parseInt(id));
  res.json(note);
});

// Default error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
});
// Custom error handler middleware
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});