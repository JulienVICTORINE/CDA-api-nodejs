const request = require('supertest');
const app = require('../index'); // En supposant que votre application Express soit exportée depuis app.js
const User = require('../models/User');


/*
* Test d'integration avec Jest et Supertest pour tester les routes
*/
describe('User Operations', () => {
    let token = '';
    let userId = '';

    beforeAll(async () => {
        // Authentification pour obtenir le token
        const loginResponse = await request(app)
            .post('/api/login')
            .send({ email: process.env.TEST_USER, password: process.env.TEST_PASSWORD });

        token = loginResponse.body.token;
        expect(loginResponse.statusCode).toBe(200);
    });


    // Test d'intégration avec Jest et Supertest pour tester la route POST /user/register
    it("créer un nouvel utilisateur", async () => {
        const userData = {
            fullName: 'Namadia Smith',
            age: 27,
            email: 'namadia@example.com',
            password: 'motdepassesecurise'
        };

        const response = await request(app)
            .post('/api/user/register')
            .set('Authorization', `Bearer ${token}`)
            .send(userData)
        
        expect(response.statusCode).toBe(201);

        // Vérification que la réponse contient les données de l'utilisateur créé
        expect(response.body).toHaveProperty('idUser');
        expect(response.body.fullName).toBe(userData.fullName);
        expect(response.body.age).toBe(userData.age);
        expect(response.body.email).toBe(userData.email);

        // Vérification que l'utilisateur est effectivement créé dans la base de données
        const createdUser = await User.findOne({ where: { email: userData.email } });
        expect(createdUser).toBeTruthy();
        expect(createdUser.fullName).toBe(userData.fullName);
        expect(createdUser.age).toBe(userData.age);
    });


    it("renvoyer un message d'ereur 400 si des données invalides sont fournies", async () => {
        const userData = {
            fullName: 'Jane Doe',
            age: 'pas un nombre', // Âge invalide
            email: 'emaillinvalide', // Email invalide
            password: 'court' // Mot de passe invalide
        };

        const response = await request(app)
            .post('/api/user/register')
            .send(userData)
            .expect(400);

        // Vérification que la réponse contient un message d'erreur
        expect(response.body).toHaveProperty('error');
    });


    it("renvoyer un message d'erreur 400 si la longueur du mot de passe est inférieure à 8 caractères", async () => {
        const userData = {
            fullName: 'Jane Doe',
            age: 30,
            email: 'jane.doe@example.com',
            password: 'court' // Longueur du mot de passe inférieure à 8 caractères
        };

        const response = await request(app)
            .post('/api/user/register')
            .send(userData)
            .expect(400);

        // Vérification que la réponse contient un message d'erreur
        expect(response.body).toHaveProperty('error');
    });

    
    // Test d'integration avec Jest et Supertest pour tester la route GET /users
    it("renvoyer tous les utilisateurs", async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.statusCode).toBe(200);
        // Vérification que la réponse contient un tableau d'utilisateurs
        expect(Array.isArray(response.body)).toBe(true);
    });


    // Test d'integration avec Jest et Supertest pour tester la route GET /users/:id
    it('renvoyer un utilisateur en fonction de son identifiant', async () => {
        // Effectuez une demande GET pour récupérer l'utilisateur par son identifiant
        const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

        // Assertions
        expect(response.statusCode).toBe(200);
        // Assurez-vous que la réponse contient les détails de l'utilisateur correcte
        expect(response.body).toHaveProperty('idUser', userId);
    });


    // Test d'integration avec Jest et Supertest pour tester la route DELETE /users/delete/:id
    it("supprimer un utilisateur en fonction de son ID", async () => {
        // Effectuez une demande DELETE pour supprimer l'utilisateur par son identifiant
        const response = await request(app)
            .delete(`/api/tasks/delete/${userId}`)
            .set('Authorization', `Bearer ${token}`);
            
        // Assertions
        expect(response.statusCode).toBe(200);
        // Vérifiez que la réponse contient un message de succès
        expect(response.body).toHaveProperty('message', 'User and associated tasks deleted successfully');

        // Vérifiez que l'utilisateur a été effectivement supprimé de la base de données
        const deletedUser = await User.findByPk(userId);
        expect(deletedUser).toBeNull();
    });


    // Test d'integration avec Jest et Supertest pour tester la route UPDATE /users/:id
    it("modifier un utilisateur en fonction de son identifiant", async () => {
        // Nouvelles informations de l'utilisateur à mettre à jour
        const updatedUserData = {
            fullName: 'Pierre DUPONT',
            age: 30,
            email: 'pierre240@example.com'
        };

        // Effectuez une demande PATCH pour mettre à jour l'utilisateur par son identifiant
        const response = await request(app)
            .patch(`/api/tasks/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserData)

        // Assertions
        expect(response.statusCode).toBe(200);

        // Vérifiez que la réponse contient les détails de l'utilisateur mis à jour
        expect(response.body.fullName).toBe(updatedUserData.fullName);
        expect(response.body.age).toBe(updatedUserData.age);
        expect(response.body.email).toBe(updatedUserData.email);
    });
});