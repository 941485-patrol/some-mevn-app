var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Animal = require('../models/animal');
const Type = require('../models/type');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Create Status', function(){
    var loggedInRequest;
    beforeEach(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
        testRequest = session(app);
        await testRequest
        .post('/api/user/register')
        .send({username:'username',password:'Password123',confirm:'Password123'})
        .expect(200)
        await testRequest
        .post('/api/user/login')
        .send({username:'username', password:'Password123'})
        .expect(200)
        .expect({"message": "You are now logged in."})
        .expect((res,err)=>{
            if (err) {throw err};
            loggedInRequest = testRequest; 
        })
    });

    it('Create a Status', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
    });

    it('Empty fields validation', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'', description:''})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Status name is required.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is required.')===false) throw new Error('Test case failed.');
        })
    });

    it('Incomplete fields validation', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'a', description:'abcd'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No status has one letter...')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is too short...')===false) throw new Error('Test case failed.');
        })
    });
    
    afterEach(async function(){
        await loggedInRequest
            .get('/api/user/logout')
            .expect(200)
            .expect({"message":"You are now logged out."})
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
    });
});