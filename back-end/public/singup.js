form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const cognome = document.getElementById('cognome').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const dataDiNascita = document.getElementById('dataDiNascita').value;
  const avatar = document.getElementById('avatar').files[0];

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('cognome', cognome);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('dataDiNascita', dataDiNascita);
  formData.append('avatar', avatar);

  try {
    const response = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registrazione avvenuta con successo');
      window.location.href = '/login.html';
    } else {
      alert('Errore: ' + data.message);
    }
  } catch (err) {
    alert('Errore di rete o server non disponibile');
    console.error(err);
  }
});
