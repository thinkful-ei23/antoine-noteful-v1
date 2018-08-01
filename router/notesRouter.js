const express = require('express');
const router = express.Router();
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/', function(req,res) {
  res.send('hello, world!');
})

router.get('/notes', (req, res) => {
  const query = req.query;
  let list = data;

  if(query.searchTerm) {
    list = list.filter(note => note.title.includes(query.searchTerm));
  }
  res.json(list);
});

router.get('/notes/:id', (req, res) => {
  let id = req.params.id;
  let note = data.find(note => note.id === parseInt(id));
  res.json(note);
});



module.exports = router;
