var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Get Status', function(){
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
    it('Get one status', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .get(`/api/status/${newStatus._id}`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body._id != newStatus._id) throw new Error('Test case failed');
        })
    });
    it('Get all statuses', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        await loggedInRequest
        .post('/api/status')
        .send({name:'name1', description:'description1'})
        .expect(200)
        .expect({'message': 'Status created.'})
        await loggedInRequest
        .get(`/api/status`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.length != 2) throw new Error('Test case failed');
        })
    });
    it('No data message if there is no status inserted', async function(){
        await loggedInRequest
        .get(`/api/status`)
        .expect(200)
        .expect({'message': 'No data.'})
    })
    it('Error on invalid url', async function(){
        await loggedInRequest
        .get(`/api/status/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if status id does not exist', async function(){
        await loggedInRequest
        .get(`/api/status/0123456789ab`)
        .expect(400)
        .expect(['Cannot find status.'])
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