const request = require('supertest');
const app = require('../index');

/*
* Test d'intégration avec Jest et Supertest pour tester les routes
*/
describe('Task Operations', () => {
    let token = '';
    let taskId = '';

    beforeAll(async () => {
        // Authentification pour obtenir le token
        const loginResponse = await request(app)
            .post('/api/login')
            .send({ email: process.env.TEST_USER, password: process.env.TEST_PASSWORD });

        token = loginResponse.body.token;
        expect(loginResponse.statusCode).toBe(200);
    });


    it('ajouter une tache avec succès', async () => {
        const taskData = {
            description: 'New Task',
            completed: false,
            owner: 10, // Mettez ici l'ID de l'utilisateur associé
        };

        const taskResponse = await request(app)
            .post('/api/task/create')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData);

        expect(taskResponse.statusCode).toBe(201);
    });


    it('récupérer toutes les taches avec succès', async () => {
        // Supposons que vous ayez déjà des tâches dans la base de données
        const tasksResponse = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(tasksResponse.statusCode).toBe(200);
        // Assurez-vous que la réponse contient un tableau de tâches
        expect(Array.isArray(tasksResponse.body)).toBe(true);
    });


    it('récupérer une tache en fonction de son ID', async () => {
        const taskResponse = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(taskResponse.statusCode).toBe(200);
        // Assurez-vous que la réponse contient les détails de la tâche correcte
        expect(taskResponse.body).toHaveProperty('idTask', taskId);
    });


    it('supprimer une tache en fonction de son ID', async () => {
        const deleteResponse = await request(app)
            .delete(`/api/tasks/delete/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.statusCode).toBe(200);
        // Assurez-vous que la réponse indique que la tâche a été supprimée avec succès
        expect(deleteResponse.body).toHaveProperty('message', 'La tâche a été supprimée avec succès');
    });


    it('modifier une tache en fonction de son ID', async () => {
        const updatedTaskData = {
            description: 'Updated Task Description',
            completed: true,
            owner: 10, // Mettez ici l'ID du nouvel utilisateur associé à la tâche
        };

        const updateResponse = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedTaskData);

        expect(updateResponse.statusCode).toBe(200);
        // Assurez-vous que la réponse indique que la tâche a été mise à jour avec succès
        expect(updateResponse.body).toHaveProperty('message', 'La tâche a été mise à jour avec succès');
    });
});