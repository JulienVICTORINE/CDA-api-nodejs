const Task = require('../models/Task');


// Contrôleur pour créer une tâche
const createTask = async (req, res) => {
    try {
        const { description, completed, owner } = req.body; 

        // Créer une nouvelle tâche
        const newTask = await Task.create({
            description,
            completed,
            owner,
        });

        // Envoyer la réponse avec la nouvelle tâche créée
        res.status(201).json(newTask);
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        console.error("Erreur lors de la création de la tâche :", error);
        res.status(500).json({ message: "Erreur lors de la création de la tâche" });
    }
};


// Contrôleur pour créer une nouvelle tâche pour un utilisateur spécifique
const createTaskForUser = async (req, res) => {
    try {
        const { description, completed } = req.body;
        const ownerId = req.params.userId; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

        // Créer une nouvelle tâche associée à l'utilisateur spécifié
        const newTask = await Task.create({
            description,
            completed,
            owner: ownerId, // Associer la tâche à l'utilisateur spécifié
        });

        // Envoyer la réponse avec la nouvelle tâche créée
        res.status(201).json(newTask);
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        console.error("Erreur lors de la création de la tâche :", error);
        res.status(500).json({ message: "Erreur lors de la création de la tâche" });
    }
};


// Contrôleur pour récupérer toutes les tâches
const getAllTasks = async (req, res) => {
    try {
        // Récupérer toutes les tâches de la base de données
        const tasks = await Task.findAll();

        // Envoyer la réponse avec toutes les tâches récupérées
        res.status(200).json(tasks);
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        console.error("Erreur lors de la récupération des tâches :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
    }
};


// Contrôleur pour récupérer une tâche par son ID
const getTaskById = async (req, res) => {
    try {
        const id = req.params.id; // Récupérer l'ID de la tâche à partir des paramètres de la requête

        // Récupérer la tâche à partir de son ID
        const task = await Task.findByPk(id);

        // Vérifier si la tâche existe
        if (!task) {
            return res.status(404).json({ message: "La tâche n'a pas été trouvée" });
        }

        // Envoyer la réponse avec la tâche récupérée
        res.status(200).json(task);
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        console.error("Erreur lors de la récupération de la tâche :", error);
        res.status(500).json({ message: "Erreur lors de la récupération de la tâche" });
    }
};


// Contrôleur pour afficher toutes les tâches pour un utilisateur spécifique
const getAllTasksForUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

        // Récupérer toutes les tâches associées à l'utilisateur spécifié
        const tasks = await Task.findAll({
            where: {
                owner: userId
            }
        });

        // Envoyer la réponse avec toutes les tâches récupérées
        res.status(200).json(tasks);
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        console.error("Erreur lors de la récupération des tâches :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
    }
};


// Contrôleur pour supprimer une tâche en fonction de son identifiant
const deleteTaskById = async (req, res) => {
    try {
        const id = req.params.id; // Récupérer l'ID de la tâche à partir des paramètres de la requête

        // Rechercher la tâche à supprimer dans la base de données
        const task = await Task.findByPk(id);

        // Vérifier si la tâche existe
        if (!task) {
            return res.status(404).json({ message: "La tâche n'a pas été trouvée" });
        }

        // Supprimer la tâche de la base de données
        await task.destroy();

        // Envoyer une réponse indiquant que la tâche a été supprimée avec succès
        res.status(200).json({ message: "La tâche a été supprimée avec succès" });
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        console.error("Erreur lors de la suppression de la tâche :", error);
        res.status(500).json({ message: "Erreur lors de la suppression de la tâche" });
    }
};


// Contrôleur pour modifier une tâche en fonction de son identifiant
const updateTaskById = async (req, res) => {
    try {
        // Récupérer l'ID de la tâche à partir des paramètres de la requête
        const id = req.params.id;

        // Récupération des données mises à jour de la tâche depuis le corps de la requête
        const { description, completed, owner } = req.body;

        // Rechercher la tâche à mettre à jour dans la base de données
        const task = await Task.findByPk(id);

        // Vérifier si la tâche existe
        if (!task) {
            return res.status(404).json({ message: "La tâche n'a pas été trouvée" });
        }

        // Mettre à jour les propriétés de la tâche avec les nouvelles valeurs
        task.description = description;
        task.completed = completed;
        task.owner = owner;

        // Enregistrer les modifications dans la base de données
        await task.save();

        // Envoyer une réponse indiquant que la tâche a été mise à jour avec succès
        res.status(200).json({ message: "La tâche a été mise à jour avec succès", task });
    } catch (error) {
        // En cas d'erreur, envoyer une réponse d'erreur
        console.error("Erreur lors de la mise à jour de la tâche :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche" });
    }
};


// // Contrôleur pour afficher toutes les tâches non complétées
// const getAllNotCompletedTasks = async (req, res) => {
//     try {
//         // Récupérer toutes les tâches non complétées de la base de données
//         const notCompletedTasks = await Task.findAll({
//             where: {
//                 completed: false
//             }
//         });

//         // Envoyer la réponse avec toutes les tâches non complétées récupérées
//         res.status(200).json(notCompletedTasks);
//     } catch (error) {
//         // En cas d'erreur, envoyer une réponse d'erreur
//         console.error("Erreur lors de la récupération des tâches non complétées :", error);
//         res.status(500).json({ message: "Erreur lors de la récupération des tâches non complétées" });
//     }
// };


// // Contrôleur pour afficher toutes les tâches complétées
// const getAllCompletedTasks = async (req, res) => {
//     try {
//         // Récupérer toutes les tâches complétées de la base de données
//         const completedTasks = await Task.findAll({
//             where: {
//                 completed: true
//             }
//         });

//         // Envoyer la réponse avec toutes les tâches complétées récupérées
//         res.status(200).json(completedTasks);
//     } catch (error) {
//         // En cas d'erreur, envoyer une réponse d'erreur
//         console.error("Erreur lors de la récupération des tâches complétées :", error);
//         res.status(500).json({ message: "Erreur lors de la récupération des tâches complétées" });
//     }
// };


module.exports = {
    createTask,
    createTaskForUser,
    getAllTasks,
    getTaskById,
    getAllTasksForUser,
    deleteTaskById,
    updateTaskById,
    // getAllNotCompletedTasks,
    // getAllCompletedTasks,
};