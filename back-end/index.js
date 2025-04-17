const express = require('express');
const mongoose = require('mongoose');
const authorsRoute = require('./routes/authors');
const Author = require('./models/Author');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());


mongoose.connect('mongodb+srv://gerfi97:Laguerradipiero7@cluster0.wq3eysj.mongodb.net/strive-blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB connesso')
    inserisciAutoriDiTest()
  })
  
  .catch((err) => console.error(err));


app.get('/', (req, res) => {
  res.send('hello world');
});


app.use('/authors', authorsRoute);


app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});


const inserisciAutoriDiTest = async () => {
    const count = await Author.countDocuments();
    if (count === 0) {
      await Author.insertMany([
        {
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario.rossi@example.com',
          dataDiNascita: '1990-01-01',
          avatar: 'https://i.pravatar.cc/150?img=11'
        },
        {
          nome: 'Anna',
          cognome: 'Bianchi',
          email: 'anna.bianchi@example.com',
          dataDiNascita: '1985-05-12',
          avatar: 'https://i.pravatar.cc/150?img=22'
        }
      ]);
      console.log('Autori di test creati');
    } else {
      console.log(`Autori già presenti: ${count}`);
    }
  };
  