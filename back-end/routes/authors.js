const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

// GET /authors → ritorna tutti gli autori
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /authors/:id → ritorna un singolo autore
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Autore non trovato' });
    }
    res.json(author);
  } catch (err) {
    res.status(400).json({ error: 'ID non valido' });
  }
});

// POST /authors → crea un nuovo autore
router.post('/', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
