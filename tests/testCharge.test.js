const autocannon = require('autocannon');

const url = 'http://localhost:3001/api'; // URL de l'endpoint à tester

// Configurer les options de test Autocannon
const opts = {
  url: `${url}/user/register`,
  connections: 10, // Nombre de connexions simultanées
  duration: 30, // Durée du test en secondes
};

// Exécuter le test Autocannon
autocannon(opts, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result);
});