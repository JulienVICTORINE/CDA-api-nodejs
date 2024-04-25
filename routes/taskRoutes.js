const express = require('express');
const router = express.Router();

// Importation du contrôleur user
const taskController = require('../controllers/taskCtrl');

// protection des routes
const { authMiddleware } = require("../middleware/auth.js");


// Route pour créer une tâche
router.post('/task/create', authMiddleware, taskController.createTask);

// Route pour créer une nouvelle tâche pour un utilisateur spécifique
router.post('/task/:id', authMiddleware, taskController.createTaskForUser);

// Route pour récupérer toutes les tâches
router.get('/tasks', authMiddleware, taskController.getAllTasks);

// Router pour récupérer une tâche par son ID
router.get('/tasks/:id', authMiddleware, taskController.getTaskById);

// Route pour récupérer toutes les tâches pour un utilisateur
router.get('/users/:userId/tasks', authMiddleware, taskController.getAllTasksForUser);

// Route pour supprimer une tâche par son ID
router.delete('/tasks/delete/:id', authMiddleware, taskController.deleteTaskById);

// Route pour modifier une tâche par son ID
router.patch('/tasks/:id', authMiddleware, taskController.updateTaskById);

// // Route pour récupérer les tâches non complétées
// router.get('/tasks/not-completed', taskController.getAllNotCompletedTasks);

// // Route pour récupérer les tâches complétées
// router.get('/tasks/completed', taskController.getAllCompletedTasks);


module.exports = router;