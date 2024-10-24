import request from 'supertest';
import express from 'express';
import authRouter from '../routers/auth';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

// Mock Mongoose User Model and JWT
jest.mock('../models/user');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRouter);

describe('Auth Routes', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('POST /auth/login', () => {
        it('should log in successfully with valid credentials', async () => {
            const mockUser = {
                _id: 'user-id',
                email: 'test@example.com',
                password: 'hashedpassword'
            };

            // Mocking User.findOne to return the user
            (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(mockUser);

            // Mock bcrypt.compare to simulate successful password comparison
            (bcrypt.compare as jest.Mock).mockImplementation(() => Promise.resolve(true));

            // Mock jwt.sign to return a token
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Logged in successfully');
            expect(res.body).toHaveProperty('userId', 'user-id');
            expect(res.headers['set-cookie']).toBeDefined(); // Ensure cookie is set
        });

        it('should return 400 if email is invalid', async () => {
            (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(null);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'invalid@example.com', password: 'password' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should return 400 if password is incorrect', async () => {
            const mockUser = { _id: 'user-id', email: 'test@example.com', password: 'hashedpassword' };
            (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockImplementation(() => {
                return Promise.resolve(false); // Return false for incorrect comparison
            });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });
    });

    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const newUser = { _id: 'user-id', name: 'Test User', email: 'test@example.com', mobile: '1234567890' };
            (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(null); // No existing user
            (bcrypt.hash as jest.Mock).mockImplementation(() => {
                return Promise.resolve('hashedpassword'); // Return true for successful comparison
            });
            (User.prototype.save as jest.MockedFunction<typeof User.prototype.save>).mockResolvedValue(newUser);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const res = await request(app)
                .post('/auth/register')
                .send({ name: 'Test User', email: 'test@example.com', phoneno: '1234567890', password: 'password', confirmPassword: 'password' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body).toHaveProperty('userId', 'user-id');
        });

        it('should return 400 if user already exists', async () => {
            const mockUser = { email: 'test@example.com' };
            (User.findOne as jest.MockedFunction<typeof User.findOne>).mockResolvedValue(mockUser); // Existing user

            const res = await request(app)
                .post('/auth/register')
                .send({ name: 'Test User', email: 'test@example.com', phoneno: '1234567890', password: 'password', confirmPassword: 'password' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });

        it('should return 400 if passwords do not match', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ name: 'Test User', email: 'test@example.com', phoneno: '1234567890', password: 'password', confirmPassword: 'differentpassword' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Passwords do not match');
        });
    });

    describe('GET /auth/logout', () => {
        it('should log out the user and clear the token cookie', async () => {
            const res = await request(app).get('/auth/logout');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Logged out successfully');
            expect(res.headers['set-cookie']).toBeDefined(); // Ensure cookie is cleared
        });
    });

    describe('GET /auth/authenticated', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/auth/authenticated');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 401 if the token is invalid', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Token is invalid'); });

            const res = await request(app)
                .get('/auth/authenticated')
                .set('Cookie', ['token=invalidtoken']); // Simulate invalid token

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });

        it('should return 200 if the token is valid', async () => {
            (jwt.verify as jest.Mock).mockReturnValue({ id: 'user-id' }); // Simulate valid token

            const res = await request(app)
                .get('/auth/authenticated')
                .set('Cookie', ['token=validtoken']); // Simulate valid token

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Authenticated');
            expect(res.body).toHaveProperty('userId', 'user-id');
        });
    });
});
