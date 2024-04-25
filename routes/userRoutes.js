const express = require('express');
const router = express.Router();

// protection des routes
const { authMiddleware } = require("../middleware/auth.js");

// Importation du contrôleur user
const userController = require('../controllers/userCtrl');


// Route pour créer un nouvel utilisateur
router.post('/user/register', userController.createUser);

// Route pour récupérer tous les utilisateurs
router.get('/users', authMiddleware, userController.getAllUsers);
// router.get('/users', userController.getAllUsers);

// Route pour récupérer un utilisateur en fonction de son identifiant
router.get('/users/:id', authMiddleware, userController.getUserById);
// router.get('/users/:id', userController.getUserById);

// Route pour supprimer un utilisateur en fonction de son identifiant
router.delete('/users/delete/:id', authMiddleware, userController.deleteUser);
// router.delete('/users/delete/:id', userController.deleteUser);

// Route pour modifier un utilisateur en fonction de son identifiant
router.patch('/users/:id', authMiddleware, userController.updateUserById);
// router.patch('/users/:id', userController.updateUserById);


// Authentification
// Route pour la connexion de l'utilisateur
router.post('/login', userController.loginUser);

// Route pour la déconnexion de l'utilisateur
router.post('/logout', authMiddleware, userController.logoutUser);


module.exports = router;