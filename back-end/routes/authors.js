const { upload } = require('../config/cloudinary');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Author = require('../models/author');





// GET /authors
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const authors = await Author.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Author.countDocuments();
    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      authors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli autori' });
  }
});

// GET /authors/:id
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Autore non trovato' });
    res.json(author);
  } catch (error) {
    res.status(400).json({ message: 'ID non valido' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, cognome, email, password, dataDiNascita, avatar } = req.body;

    // Controlla se l'email è già registrata
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuovo autore con la password criptata
    const newAuthor = new Author({
      nome,
      cognome,
      email,
      password: hashedPassword,
      dataDiNascita,
      avatar,
    });

    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    console.error(error); // Aggiungi un log dell'errore per facilitare il debug
    res.status(400).json({ message: 'Errore nella creazione dell\'autore' });
  }
});

// PUT /authors/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Autore non trovato' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Errore nell\'aggiornamento dell\'autore' });
  }
});

// DELETE /authors/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Autore non trovato' });
    res.json({ message: 'Autore eliminato con successo' });
  } catch (error) {
    res.status(400).json({ message: 'Errore nella cancellazione dell\'autore' });
  }
});

router.patch('/:authorId/avatar', upload.single('avatar'), async (req, res) => {
    try {
      const author = await Author.findByIdAndUpdate(
        req.params.authorId,
        { avatar: req.file.path },
        { new: true }
      );
      res.json(author);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel caricamento avatar' });
    }
  });
  


  

module.exports = router;
