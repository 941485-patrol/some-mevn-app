var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Delete Status', function(){
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
    it('Delete a Status', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .delete(`/api/status/${newStatus._id}`)
        .expect(200)
        .expect({'message': 'Status deleted.'})
    });
    it('Error on invalid type id url', async function(){
        await loggedInRequest
        .delete(`/api/status/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if type id not found', async function(){
        await loggedInRequest
        .delete(`/api/status/0123456789ab`)
        .expect(400)
        .expect(['Error deleting data.'])
    });
    it('Error if empty type id', async function(){
        await loggedInRequest
        .delete(`/api/status/`)
        .expect(404)
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