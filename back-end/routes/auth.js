const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Author = require('../models/author');
const passport = require('passport');
require('passport'); 

const app = express();
app.use(passport.initialize());

const authenticateToken = require('../middleware/auth'); // Assicurati di avere il middleware di autenticazione


const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { nome, cognome, email, password, dataDiNascita, avatar } = req.body;

    const existingUser = await Author.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Cripta SOLO qui
    const hashedPassword = await bcrypt.hash(password, 10);

    // NON fare hash qui, lo fa lo schema!
const newAuthor = new Author({
  nome,
  cognome,
  email,
  password, 
  dataDiNascita,
  avatar,
});


    await newAuthor.save();

    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la registrazione', error: error.message });
  }
});





router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email:", email);
    console.log("Password inserita:", password);

    const user = await Author.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email non trovata' });
    }

    console.log("Password nel DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    

    if (!isMatch) {
      return res.status(401).json({ message: 'Password errata' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Token generato:", token);
    res.json({ message: 'Login riuscito', token });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login', error: error.message });
  }
});




// Endpoint protetto /me che restituisce i dettagli dell'utente loggato
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Aggiungi un log per verificare che req.user contenga i dati corretti
    console.log("User ID dal token:", req.user.id);

    // Usa req.user.id per ottenere l'ID dell'utente collegato al token
    const user = await Author.findById(req.user.id).select('-password'); // Non includere la password

    if (!user) {
      console.log("Utente non trovato per ID:", req.user.id);
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    console.log("Dettagli utente trovato:", user);
    res.json(user); // Restituisci i dettagli dell'utente
  } catch (err) {
    console.error("Errore durante la ricerca dell'utente:", err);
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
});


// Avvia il login con Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback dopo il login Google
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Genera un JWT e lo manda al frontend
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Invia il token al frontend, o reindirizza con il token come query param
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);


module.exports = router;
