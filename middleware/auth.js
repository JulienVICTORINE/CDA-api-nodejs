const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config(); // Chargez les variables d'environnement à partir de .env

const User = require('../models/User');

// Fonction pour générer un token JWT
const generateAuthToken = (user) => {
    // Créer un token JWT avec les informations de l'utilisateur
    const token = jwt.sign({ idUser: user.idUser }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    console.log("Token :", token);
    return token;
};


// Middleware personnalisé pour protéger les routes
const authMiddleware = async (req, res, next) => {
    try {
        // Récupérer le token d'authentification depuis l'en-tête de la requête
        const header = req.headers.authorization;
        const token = header && header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        // Vérifier si le token est valide
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Rechercher l'utilisateur correspondant au token
        const user = await User.findOne(decoded.id);

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        };

        // Attacher les informations de l'utilisateur à l'objet req pour une utilisation ultérieure
        req.user = user;

        // Passer au prochain middleware ou à la fonction de routage
        next();
    } catch (error) {
        // Gestion des erreurs d'authentification
        console.error(error);
        res.status(401).json({ message: error.message });
    }
};


// Fonction pour vérifier un token JWT
const verifyToken = (token) => {
    try {
        // Vérifier si le token est présent
        if (!token) {
            throw new Error('Token is missing');
        }

        // Vérifier si le token est valide
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Si le token est valide, renvoyer les informations décodées du token
        return decoded;
    } catch (error) {
        // Si une erreur se produit lors de la vérification du token, renvoyer null
        console.error(error.message);
        return null;
    }
};


module.exports = { generateAuthToken, authMiddleware, verifyToken };