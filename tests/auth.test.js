const request = require('supertest');
const app = require('../index'); // Assurez-vous d'importer correctement votre application

/*
* Test d'intégration avec Jest et Supertest pour tester la route /login avec de bonnes informations d'identification
*/
describe('POST /login', () => {
    it('devrait renvoyer un jeton valide avec des identifiants corrects', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: process.env.TEST_USER, password: process.env.TEST_PASSWORD }) // Assurez-vous que ces variables d'environnement sont définies

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});


/*
* Test d'intégration avec Jest et Supertest pour tester la route /login avec des informations d'identification incorrectes
*/
describe('POST /login', () => {
    it('devrait renvoyer une erreur avec des identifiants incorrects', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        // Assertions
        expect(response.status).toBe(401); // Supposons que vous renvoyez 401 pour des identifiants incorrects
    });
});


/*
* Test de pénétration avec Jest et Supertest pour tester la sécurité de la route /login en essayant une injection SQL
*/
describe('Test de pénétration - Injection SQL', () => {
    it('devrait renvoyer une réponse sans erreur avec une injection SQL', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: '1=1--', password: 'anything' }); // Injection SQL potentielle

        // Assertions
        expect(response.status).not.toBe(500);
    });
});


/*
* Test de pénétration avec Jest et Supertest pour tester la sécurité de la route /login en essayant une attaque XSS
*/
describe('Test de pénétration - Attaque XSS', () => {
    it('devrait renvoyer une réponse sans erreur avec une attaque XSS', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: '<script>alert("attention attaque XSS")</script>', password: 'anything' }); // Attaque XSS potentielle

        // Assertions
        expect(response.status).not.toBe(500);
    });
});