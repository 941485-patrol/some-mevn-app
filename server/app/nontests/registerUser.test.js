var app = require('../testServer');
const request = require('supertest');
const agent = request.agent(app);
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const User = require('../models/user');

describe('Register user', function(){
    it ('Register a user', function(done){
        agent
        .post('/api/user/register')
        .send({username:'username2', password:'Password1234', confirm:'Password1234'})
        .expect(200)
        .expect({"message": "User registered."}, done);
    });

    it ('Double entry', function(done){
        agent
            .post('/api/user/register')
            .send({username:'username2', password:'Password1234', confirm:'Password1234'})
            .expect(400)
            .expect(['Username already exists.'], done);
    });

    it ('Empty fields validation', function(done){
        agent
            .post('/api/user/register')
            .send({username:'', password:'', confirm:''})
            .expect(400)
            .expect((res, err)=>{
                if (res.body.includes('Username is required.')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Password is required.')===false) throw new Error('Test case has failed.');
            }).end(done);
    });
    it ('Incomplete fields validation', function(done){
        agent
            .post('/api/user/register')
            .send({username:'usernm', password:'Pas123', confirm:'Pas123'})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Username must be more than 8 characters')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Password must be more than 8 characters')===false) throw new Error('Test case has failed.');
            });
    });
    it ('Password validation', function(done){
        agent
            .post('/api/user/register')
            .send({username:'username', password:'password123', confirm:'password123'})
            .expect(400)
            .expect(['Password must have a captial letter and a number.']);
        agent
            .post('/api/user/register')
            .send({username:'username', password:'passwordstrong', confirm:'passwordstrong'})
            .expect(400)
            .expect(['Password must have a captial letter and a number.']);
    });
});