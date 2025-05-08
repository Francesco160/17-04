const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const postsRoute = require('./routes/posts');
const authorsRoute = require('./routes/authors');
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware/auth');
const Author = require('./models/author'); 
const Post = require('./models/blogPost'); 

require('passport');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; 
const MONGODB_URL = process.env.MONGODB_URL;  
const DBname = "provaDB";

// Middleware
app.use(express.json());


app.use(passport.initialize());

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



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async function(accessToken, refreshToken, profile, done) {
  try {
    // Cerca un utente con googleId
    let user = await Author.findOne({ googleId: profile.id });

    // Se non esiste, cerca per email (potresti aver creato l'utente prima manualmente)
    if (!user) {
      user = await Author.findOne({ email: profile.emails[0].value });

      // Se esiste per email, aggiorna con googleId
      if (user) {
        user.googleId = profile.id;
        await user.save();
      } else {
        // Nessun utente trovato, blocca il login
        return done(null, false, { message: 'Utente non trovato. Devi registrarti prima.' });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}
));


// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
