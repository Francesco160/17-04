const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataDiNascita: { type: String, required: true },
  avatar: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema);
