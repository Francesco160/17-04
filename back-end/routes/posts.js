const { upload } = require('../config/cloudinary');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/blogPost'); 
const blogPost = require('../models/blogPost');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');





// GET /posts con paginazione
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const posts = await Post.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Post.countDocuments();
    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei post' });
  }
});


// GET /posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'ID non valido' });
  }
});

// POST /posts
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: 'Errore nella creazione del post' });
  }
});

// PUT /posts/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Post non trovato' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Errore nell\'aggiornamento del post' });
  }
});

// DELETE /posts/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Post non trovato' });
    res.json({ message: 'Post eliminato con successo' });
  } catch (error) {
    res.status(400).json({ message: 'Errore nella cancellazione del post' });
  }
});

// Rotta per aggiornare la cover di un post
router.patch('/:id/cover', upload.single('cover'), async (req, res) => {
    try {
      const { id } = req.params;
  
      // Verifica che il file sia stato inviato
      if (!req.file) {
        return res.status(400).json({ message: 'Nessun file caricato.' });
      }
  
      // Carica l'immagine su Cloudinary
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: 'EPICODE', // Specifica la cartella su Cloudinary
      });
  
      // Trova il post e aggiorna la cover
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post non trovato' });
      }
  
      // Aggiorna la cover con l'URL di Cloudinary
      post.cover = result.secure_url;
      await post.save();
  
      res.json({ message: 'Cover aggiornata con successo', post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Errore nel caricamento della cover', error });
    }
  });
  
  

module.exports = router;
