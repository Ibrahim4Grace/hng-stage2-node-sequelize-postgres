import request from 'supertest';
import app from '../server';
import jwt from 'jsonwebtoken';
import { User, Organization } from '../models/index.js';
import { sequelize } from '../config/db';
import customEnv from '../config/customEnv.js';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await User.sync({ force: true });
      await Organization.sync({ force: true });
      await sequelize.sync({ force: true }); // Sync all models including UserOrganizations
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });
  //   beforeAll(async () => {
  //     try {
  //       await sequelize.authenticate();
  //       console.log('Connection has been established successfully.');
  //       await sequelize.sync({ force: true }); // Reset database before tests
  //     } catch (error) {
  //       console.error('Unable to connect to the database:', error);
  //     }
  //   });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('Should Register User Successfully with Default Organisation', async () => {
      const res = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        phone: '1234567890',
      });

      console.log(res.body); // Additional logging for debugging
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.firstName).toBe('John');
      expect(res.body.data.user.lastName).toBe('Doe');
      expect(res.body.data.user.email).toBe('john.doe@example.com');
      expect(res.body.data.user.phone).toBe('1234567890');
      expect(res.body.data.accessToken).toBeDefined();

      const organization = await Organization.findOne({
        where: { name: "John's Organization" },
      });
      expect(organization).toBeDefined();
    });

    it('Should Fail If Required Fields Are Missing', async () => {
      const res = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      });

      console.log(res.body); // Additional logging for debugging
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('Should Fail if there’s Duplicate Email or UserID', async () => {
      await request(app).post('/auth/register').send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        phone: '0987654321',
      });

      const res = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.doe@example.com',
        password: 'Password123!',
        phone: '0987654321',
      });

      console.log(res.body); // Additional logging for debugging
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
      });
    });

    it('Should log the user in successfully', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'john.doe@example.com',
        password: 'Password123!',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toMatchObject({
        email: 'john.doe@example.com',
      });
    });
    // it('Should Log the user in successfully', async () => {
    //   await request(app).post('/auth/register').send({
    //     firstName: 'Jane',
    //     lastName: 'Doe',
    //     email: 'jane.doe@example.com',
    //     password: 'Password123!',
    //   });

    //   const user = await User.findOne({
    //     where: { email: 'jane.doe@example.com' },
    //   });
    //   console.log('Registered User:', user);

    //   const res = await request(app).post('/auth/login').send({
    //     email: 'jane.doe@example.com',
    //     password: 'Password123!',
    //   });

    //   console.log('Login Response:', res.body);
    //   expect(res.status).toBe(200);
    //   expect(res.body.status).toBe('success');
    //   expect(res.body.data.user.email).toBe('jane.doe@example.com');
    //   expect(res.body.data.accessToken).toBeDefined();
    // });

    it('Should Fail if credentials are incorrect', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

      console.log(res.body); // Additional logging for debugging
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Authentication failed');
    });
  });

  describe('GET /organizations', () => {
    let token;

    beforeAll(async () => {
      const res = await request(app).post('/auth/register').send({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        password: 'Password123!',
        phone: '1122334455',
      });

      token = res.body.data.accessToken;
    });

    it('Should Get User Organizations', async () => {
      const res = await request(app)
        .get('/api/organizations')
        .set('Authorization', `Bearer ${token}`);

      console.log(res.body); // Additional logging for debugging
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.organizations.length).toBeGreaterThan(0);
    });

    it('Should Fail if user is unauthorized', async () => {
      const res = await request(app).get('/api/organizations');

      console.log(res.body); // Additional logging for debugging
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Unauthorized');
    });
  });
  // Add JWT Token Generation and Password Hashing tests here

  describe('JWT Token Generation', () => {
    it('Should generate a valid JWT token', () => {
      const payload = { userId: 'testUserId' };
      const token = jwt.sign(payload, customEnv.jwtSecret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, customEnv.jwtSecret);
      expect(decoded.userId).toBe('testUserId');
    });
  });

  describe('Password Hashing', () => {
    it('Should hash and compare the password correctly', async () => {
      const password = 'Password123!';
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hash);
      expect(isMatch).toBe(true);
    });
  });
});
