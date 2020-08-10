var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Get Type', function(){
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
    it('Get one type', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .get(`/api/type/${newType._id}`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body._id != newType._id) throw new Error('Test case failed');
        })
    });
    it('Get all types', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        await loggedInRequest
        .post('/api/type')
        .send({name:'anotherName', environment:'anotherEnvironment'})
        .expect(200)
        .expect({"message": "Type created"})
        await loggedInRequest
        .get(`/api/type`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.length != 2) throw new Error('Test case failed');
        })
    });
    it('No data message if there is no type inserted', async function(){
        await loggedInRequest
        .get(`/api/type`)
        .expect(200)
        .expect({'message': 'No data.'})
    })
    it('Error on invalid url', async function(){
        await loggedInRequest
        .get(`/api/type/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if type id does not exist', async function(){
        await loggedInRequest
        .get(`/api/type/0123456789ab`)
        .expect(400)
        .expect(['Cannot find type.'])
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