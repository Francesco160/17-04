const { upload } = require('../config/cloudinary');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/blogPost'); 
const blogPost = require('../models/blogPost');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const authenticateToken = require('../middleware/auth');





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

router.post('/', authenticateToken, async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.user._id });
    await post.save();

    const author = await Author.findById(req.user._id);

    // Invia email di conferma pubblicazione
    await sendEmail(
      author.email,
      'Hai pubblicato un nuovo post!',
      `<h2>Il tuo nuovo post "${post.title}" è stato pubblicato con successo!</h2>`
    );

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
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



  // Commenti



  // GET /posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei commenti' });
  }
});

// GET /posts/:id/comments/:commentId
router.get('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero del commento' });
  }
});

// POST /posts/:id/comments
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    post.comments.push(req.body); // req.body: { text, author }
    await post.save();
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiunta del commento' });
  }
});

// PUT /posts/:id/comments/:commentId
router.put('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    comment.set(req.body); // req.body può contenere text e/o author
    await post.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del commento' });
  }
});

// DELETE /posts/:id/comments/:commentId
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    comment.remove();
    await post.save();
    res.json({ message: 'Commento eliminato' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione del commento' });
  }
});

  
  

module.exports = router;
