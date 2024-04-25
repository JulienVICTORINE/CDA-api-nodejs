const autocannon = require('autocannon');

const url = 'http://localhost:3001/api'; // Assurez-vous de spécifier le bon port et le bon chemin pour vos routes

// Configurer les options de test Autocannon
const opts = {
  url: `${url}/user/register`, // Endpoint à tester
  connections: 10, // Nombre de connexions simultanées
  pipelining: 1, // Nombre de requêtes à envoyer en parallèle sur chaque connexion
  duration: 10, // Durée du test en secondes
};

// Exécuter le test Autocannon
autocannon(opts, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result);
});


// autocannon -c 500 -d 5 http://localhost:3001/api/user/register