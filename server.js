'use strict';
const express = require('express');
const morgan = require('morgan');
const app = express(); 
const notesRouter = require('./router/notesRouter');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use('/api', notesRouter);

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});