const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const postsRoute = require('./routes/posts');
const authorsRoute = require('./routes/authors');
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware/auth');
const Author = require('./models/author'); // Assicurati di avere il modello Author definito in models/author.js
const Post = require('./models/blogPost'); // Assicurati di avere il modello Post definito in models/blogPost.js


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; 
const MONGODB_URL = process.env.MONGODB_URL;  
const DBname = "provaDB";

// Middleware
app.use(express.json());


// Routes

// Servire file statici dalla cartella "public"
app.use(express.static('public'));  // Serve tutto il contenuto della cartella "public"

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// Rotta per la pagina di login (GET)
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');  // Servi il file login.html
});

// Rotta per la pagina di registrazione (GET)
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');  // Servi il file signup.html
});

// Assicurati che public/homepage.html esista
app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});


// Rotte pubbliche senza bisogno di autenticazione
app.use('/login', authRoutes);  // Login è pubblico
app.use('/signup', authRoutes); // Signup è pubblico
app.use('/auth', authRoutes);
app.use('/', authRoutes);




app.use('/authors', authorsRoute);
app.use('/posts', authenticateToken,  postsRoute);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

});

// Configura Multer per la gestione dei file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connessione al DB
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('MongoDB connesso');
  })
  .catch((err) => console.error(err));


// Route base
app.get('/', (req, res) => {
  res.send('Hello World');
});


// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
