// homepage.js
const token = localStorage.getItem('token');  // Recupera il token salvato

fetch('http://localhost:3001/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`  // Invia il token nel header Authorization
  }
})
  .then(response => response.json())
  .then(data => {
    console.log(data);  // Visualizza i dati ricevuti nel browser
    document.getElementById('nome').textContent = data.nome;
    document.getElementById('email').textContent = data.email;
    // Puoi aggiungere altri campi come cognome, avatar, ecc.
  })
  .catch(error => console.error('Errore:', error));
