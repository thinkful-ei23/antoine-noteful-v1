const express = require('express');
const router = express.Router();
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/', function(req,res) {
  res.send('hello, world!');
});

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

router.post('/notes', (req, res, next) => {
  console.log(req);
  const { title, content } = req.body;

  const newItem = { title, content };
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

router.delete('/notes/:id', (req, res) => {
  const {id} = req.params;

  notes.delete(id, err => {
    if(err) {
      res.status(500).json(err);
    } else {
      res.status(204).json('no-content');
    }
  });
});



module.exports = router;
