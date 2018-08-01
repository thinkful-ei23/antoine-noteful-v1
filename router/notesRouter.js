const express = require('express');
const router = express.Router();
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err,list) => {
    if(err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filter array
  });
 
});

router.get('/notes/:id', (req, res) => {
  let { id } = req.params;

  notes.find(id, (err, list) => {
    if(err) {
      return next(err);
    }
    res.json(list);
  });
  
  
});

router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
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
  console.log("Before delete:", notes.data.length);
 
  notes.delete(id, (err, len) => {
    if(err) {
      res.status(500).json(err);
    } else if(len === null){
      res.status(404).json('Not found');
    } else {
      res.sendStatus(204);
    }
  });
  console.log("After deleting", id, "remaining:", notes.data.length)

});

module.exports = router;
