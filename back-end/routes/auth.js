const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Author = require('../models/author');
const authenticateToken = require('../middleware/auth'); // Assicurati di avere il middleware di autenticazione


const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { nome, cognome, email, password } = req.body;

    // Controlla se l'email è già registrata
    const existingUser = await Author.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAuthor = new Author({
      nome,
      cognome,
      email,
      password: hashedPassword,
    });

    await newAuthor.save();

    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (error) {
    console.error("Errore durante la registrazione:", error); // Aggiungi questo log
    res.status(500).json({ message: 'Errore durante la registrazione', error: error.message });
  }
});



// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Author.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email non trovata' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password errata' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login avvenuto con successo', token });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login', error: error.message });
  }
});

// Rotta /me: restituisce l’utente autenticato
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await Author.findById(req.user.id).select('-password'); 
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
});
module.exports = router;
