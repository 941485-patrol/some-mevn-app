var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const User = require('../models/user');

describe('Login user', function(){
    beforeEach(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
    });
    it ('Login a user then logout', async function(){
        await request(app)
            .post('/api/user/register')
            .send({username:'username', password:'Password123', confirm:'Password123'})
            .expect(200)
            .expect({"message": "User registered."});
        await request(app)
            .post('/api/user/login')
            .send({username:'username', password:'Password123'})
            .expect(200)
            .expect({"message": "You are now logged in."})
        await request(app)
            .get('/api/user/logout')
            .expect(200)
            .expect({"message": "You are now logged out."})
    });
    it ('Login validations', async function(){
        await request(app)
            .post('/api/user/register')
            .send({username:'username', password:'Password123', confirm:'Password123'})
            .expect(200)
            .expect({"message": "User registered."});
        await request(app)
            .post('/api/user/login')
            .send({username:'username', password:'password123'})
            .expect(400)
            .expect(['Wrong credentials.'])
        await request(app)
            .post('/api/user/login')
            .send({username:'username', password:'password123'})
            .expect(400)
            .expect(['Wrong credentials.'])
        await request(app)
            .post('/api/user/login')
            .send({username:'', password:''})
            .expect(400)
            .expect(['Wrong credentials.'])
    });
    afterEach(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
    });
});