const mongoose = require('mongoose');
const request = require('supertest');

require('dotenv').config();

const app = require('../src/app');
const User = require('../src/models/db.Users');

describe('Auth integration tests', () => {
    const signupCandidates =  '/api/auth/register';
    const loginPath = '/api/auth/login';
    const mePath = '/api/auth/me';

    const testUser = {
        name: 'Test User',
        email: `test_${Date.now()}@shopsmart.com`,
        password: 'Passw0rd!'
    };

    let authToken = '';
    let signupPath = '/api/auth/register';

    beforeAll(async () => {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is required to run integration tests');
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        const probeEmail = `probe_${Date.now()}_${Math.random().toString(36).slice(2)}@shopsmart.com`;
            const probeRes = await request(app).post(signupCandidates).send({
                name: 'Probe User',
                email: probeEmail,
                password: 'ProbePass123!'
            });

            if (probeRes.statusCode !== 404) {
                signupPath = signupCandidates;
                await User.deleteOne({ email: probeEmail });
            }
    });

    afterAll(async () => {
        await User.deleteMany({
            email: { $regex: /@shopsmart\.com$/ }
        });

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    });

    it('should signup successfully with 201', async () => {
        const res = await request(app).post(signupPath).send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user.email', testUser.email);
    });

    it('should fail duplicate signup', async () => {
        const res = await request(app).post(signupPath).send(testUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Email already in use');
    });

    it('should login successfully and return token', async () => {
        const res = await request(app).post(loginPath).send({
            email: testUser.email,
            password: testUser.password
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('token');

        authToken = res.body.token;
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app).post(loginPath).send({
            email: testUser.email,
            password: 'wrong-password'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should access /me with valid token', async () => {
        const res = await request(app)
            .get(mePath)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email', testUser.email);
        expect(res.body).toHaveProperty('name', testUser.name);
        expect(res.body).not.toHaveProperty('password');
    });

    it('should return unauthorized for /me without token', async () => {
        const res = await request(app).get(mePath);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Unauthorized');
    });
});
