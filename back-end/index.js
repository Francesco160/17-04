const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const DBname = "provaDB";

// Middleware
app.use(express.json());

// Definisci lo schema e il modello per Author
const AuthorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataDiNascita: { type: String, required: true },
  avatar: { type: String, required: true },
});



const Author = mongoose.model('Author', AuthorSchema);

// Connessione al DB
mongoose.connect('mongodb+srv://gerfi97:gerfi@cluster0.wq3eysj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' + DBname)
  .then(() => {
    console.log('MongoDB connesso');
  })
  .catch((err) => console.error(err));


// Route base
app.get('/', (req, res) => {
  res.send('Hello World');
});

// ROTTE /authors

// GET /authors - tutti gli autori
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli autori' });
  }
});

// GET /authors/:id - singolo autore
app.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Autore non trovato' });
    res.json(author);
  } catch (error) {
    res.status(400).json({ message: 'ID non valido' });
  }
});

// POST /authors - crea nuovo autore
app.post('/authors', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ message: 'Errore nella creazione dell\'autore' });
  }
});

app.put('/authors/:id', async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAuthor) return res.status(404).json({ message: 'Autore non trovato' });
    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ message: 'Errore nell\'aggiornamento dell\'autore' });
  }
});

// DELETE /authors/:id - elimina un autore
app.delete('/authors/:id', async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) return res.status(404).json({ message: 'Autore non trovato' });
    res.json({ message: 'Autore eliminato con successo' });
  } catch (error) {
    res.status(400).json({ message: 'Errore nell\'eliminazione dell\'autore' });
  }
});

const PostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  author: { type: String, required: true },  
  content: { type: String, required: true },
});

const Post = mongoose.model('Post', PostSchema);


// POST /posts - crea un nuovo post
app.post('/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body); 
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: 'Errore nella creazione del post' });
  }
});

// GET /posts - ottieni tutti i post con paginazione
app.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagina e limite di risultati per pagina
    const posts = await Post.find()
    .skip((page - 1) * limit)  // Calcola l'offset
    .limit(parseInt(limit));   // Limita il numero di post per pagina
    const totalPosts = await Post.countDocuments(); // Conta il totale dei post
    res.json({
      totalPosts,
      posts,
      totalPages: Math.ceil(totalPosts / limit), // Calcola il numero totale di pagine
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei post' });
  }
});

// GET /posts/:id - ottieni un post specifico
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'ID non valido' });
  }
});


// GET /authors - tutti gli autori con paginazione
app.get('/authors', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Parametri per paginazione
    const authors = await Author.find()
    .skip((page - 1) * limit)  // Calcola l'offset
    .limit(parseInt(limit));   // Limita il numero di autori per pagina
    const totalAuthors = await Author.countDocuments(); // Conta il totale degli autori
    res.json({
      totalAuthors,
      authors,
      totalPages: Math.ceil(totalAuthors / limit), // Calcola il numero totale di pagine
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli autori' });
  }
});


// GET /posts - ottieni tutti i post con paginazione
app.get('/posts', async (req, res) => {
  try {
    // Parametri di paginazione (page e limit)
    const { page = 1, limit = 10 } = req.query; // Imposta pagina e limite con valori predefiniti

    // Recupera i post con offset e limite
    const posts = await Post.find()
    .skip((page - 1) * limit)  // Calcola l'offset
    .limit(parseInt(limit));   // Limita il numero di post per pagina

    // Conta il numero totale di post
    const totalPosts = await Post.countDocuments(); // Conta il totale dei post

    // Restituisci i dati con informazioni sulla paginazione
    res.json({
      totalPosts,
      posts,
      totalPages: Math.ceil(totalPosts / limit), // Calcola il numero totale di pagine
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei post' });
  }
});


// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
