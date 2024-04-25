// Debut de mon serveur express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const helmet = require('helmet'); // éviter la faille XSS

// Je crée une instance de mon serveur express
const app = express();
const port = 3001;

// Importation des routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use(cors());

// Utilise Helmet pour éviter les problèmes de sécurité avec l'option d'évaluation non sécurisée (attaque XSS)
app.use(
    helmet.contentSecurityPolicy({
        directives: {
          "default-src": ["'self'"],
        //   "connect-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["https://http.cat/images/404.jpg 'self'", "data:"],
        //   "style-src-elem": ["'self'", "data:"],
            //script src with authorization on http://localhost:3000/apidoc/index.html
          "script-src": ["'self'", "'unsafe-eval'"],        
          "object-src": ["'none'"],
          "script-src-elem": ["'self'", "'unsafe-eval'"]
          
            
        },
      })
);


// indiquer à express qu'on peut séparer les données au format JSON
app.use(express.json())

// le middleware suivant avant la route d'API - CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());


app.use('/api/', userRoutes);
app.use('/api/', taskRoutes);


// Démarrer le serveur
app.listen(port, function () {
    console.log('Serveur démarré sur le port 3001 ...............................................................');
});


module.exports = app;