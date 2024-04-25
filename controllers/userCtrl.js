// Import des modèles définis avec Sequelize
const User = require('../models/User.js');

// Import de la bibliothèque de validation des données
const Joi = require('joi');

// Import de la bibliothèque de hachage de mot de passe
const bcrypt = require('bcrypt');

const { generateAuthToken } = require('../middleware/auth.js');

// Import du model Task
const Task = require('../models/Task.js');



// Contrôleur pour créer un utilisateur
const createUser = async (req, res) => {
    try {
        // Vérification de la longueur du mot de passe
        if (req.body.password.length < 8) {
            throw "La longueur du mot de passe doit être supérieure à 8 caractères";
        }

        // Définition du schéma de validation pour les données de l'utilisateur
        const schema = Joi.object({
            fullName: Joi.string().required(),
            age: Joi.number().integer().min(18).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(255).required(),
        });

        // Fonction de validation des données du formulaire
        // Validation des données de la requête
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // // Vérifier si l'utilisateur existe déjà
        // const existingUser = await User.findOne({ where: { email } });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        // }

        // Hachage du mot de passe en utilisant la valeur définie dans le fichier .env
        const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

        const newUser = await User.create({
            fullName: value.fullName,
            age: value.age,
            email: value.email,
            password: hashedPassword,
        })

        if (!newUser) {
            throw "Les informations relatives à l'utilisateur ne sont pas correctes";
        }

        // Réponse avec l'utilisateur créé
        res.status(201).json(newUser);
    } catch (err) {
        // Gestion des erreurs
        console.error("Erreeur lors de la création de l'utilisateur :", err);
        res.status(400).json({ error: err });
    }

};


// Contrôleur pour récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        // Récupérer tous les utilisateurs depuis la base de données
        const users = await User.findAll();

        // Vérifier s'il n'y a aucun utilisateur trouvé
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Renvoyer la liste des utilisateurs
        res.status(200).json(users);
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching users' });
    }
};


// Contrôleur pour récupérer un utilisateur en fonction de son identifiant
const getUserById = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
        const { id } = req.params;

        // Recherche de l'utilisateur dans la base de données en fonction de l'ID
        const user = await User.findByPk(id);

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Renvoyer l'utilisateur trouvé
        res.status(200).json(user);
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the user' });
    }
};


// Contrôleur pour supprimer un utilisateur en fonction de son identifiant
const deleteUser = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à supprimer depuis les paramètres de la requête
        const { id } = req.params;

        // Recherche de l'utilisateur dans la base de données en fonction de l'ID
        const user = await User.findByPk(id);

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Supprimer toutes les tâches associées à cet utilisateur
        await Task.destroy({
            where: {
                owner: id
            }
        });

        // Supprimer l'utilisateur de la base de données
        await user.destroy();

        // Renvoyer un message de succès
        res.status(200).json({ message: 'User and associated tasks deleted successfully' });
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the user and associated tasks' });
    }
};


// Contrôleur pour modifier un utilisateur
const updateUserById = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à modifier depuis les paramètres de la requête
        const { id } = req.params;

        // Recherche de l'utilisateur dans la base de données en fonction de l'ID
        const user = await User.findByPk(id);

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Définition du schéma de validation pour les données de mise à jour de l'utilisateur
        const schema = Joi.object({
            fullName: Joi.string(),
            age: Joi.number().integer().min(18),
            email: Joi.string().email(),
            password: Joi.string().min(8).max(255),
        });

        // Validation des données de mise à jour de l'utilisateur
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Mise à jour des données de l'utilisateur avec celles fournies dans le corps de la requête
        user.fullName = value.fullName || user.fullName;
        user.age = value.age || user.age;
        user.email = value.email || user.email;

        // Vérifier si un nouveau mot de passe est fourni
        if (value.password) {
            // Vérification de la longueur du nouveau mot de passe
            if (value.password.length < 8) {
                throw "La longueur du nouveau mot de passe doit être supérieure à 8 caractères";
            }

            // Hachage du nouveau mot de passe
            const hashedPassword = await bcrypt.hash(value.password, parseInt(process.env.SALT_ROUNDS));
            user.password = hashedPassword;
        }

        // Enregistrer les modifications dans la base de données
        await user.save();

        // Renvoyer l'utilisateur mis à jour
        res.status(200).json(user);
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the user' });
    }
};


// Authentification utilisateur
// Contrôleur pour la connexion de l'utilisateur
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Le nom d\'utilisateur ou mot de passe est incorrect' });
        }

        // Générer et retourner un token d'authentification si l'authentification est réussie, sauvegarder le token d'authentification
        const token = generateAuthToken(user);
        user.token = token;
        await user.save();

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const logoutUser = async (req, res) => {
    try {
        // Récupérer l'utilisateur à partir du token d'authentification
        const user = req.user;

        // Effacer le token d'authentification de l'utilisateur
        user.token = null;

        // Sauvegarder les modifications dans la base de données
        await user.save();

        // Renvoyer une réponse de succès
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Gestion des erreurs
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while logging out' });
    }
};



module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserById,
    loginUser,
    logoutUser,
};