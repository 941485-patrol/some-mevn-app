var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const User = require('../models/user');

describe('Register user', function(){
    beforeEach(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
    });
    it ('Register a user', async function(){
        await request(app)
            .post('/api/user/register')
            .send({username:'username', password:'Password123', confirm:'Password123'})
            .expect(200)
            .expect({"message": "User registered."});
    });
    it ('Double entry', async function(){
        await request(app)
            .post('/api/user/register')
            .send({username:'username', password:'Password123', confirm:'Password123'})
            .expect(200)
            .expect({"message": "User registered."});
        await request(app)
            .post('/api/user/register')
            .send({username:'username', password:'Password123', confirm:'Password123'})
            .expect(400)
            .expect(['Username already exists.']);
    });
    it ('Empty fields validation', async function(){
        await request(app)
            .post('/api/user/register')
            .send({username:'', password:'', confirm:''})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Username is required.')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Password is required.')===false) throw new Error('Test case has failed.');
            });
    });
    it ('Incomplete fields validation', async function(){
        await request(app)
            .post('/api/user/register')
            .send({username:'usernm', password:'Pas123', confirm:'Pas123'})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Username must be more than 8 characters')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Password must be more than 8 characters')===false) throw new Error('Test case has failed.');
            });
    });
    it ('Password validation', async function(){
        await request(app)
            .post('/api/user/register')
            .send({username:'username', password:'password123', confirm:'password123'})
            .expect(400)
            .expect(['Password must have a captial letter and a number.']);
        await request(app)
            .post('/api/user/register')
            .send({username:'username', password:'passwordstrong', confirm:'passwordstrong'})
            .expect(400)
            .expect(['Password must have a captial letter and a number.']);
    });
    afterEach(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
    });
});