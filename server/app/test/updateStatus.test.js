var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Update Status', function(){
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
    it('Update a Status', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .put(`/api/status/${newStatus._id}`)
        .send({name:'name1', description:'description1'})
        .expect(301)
    });
    it('Avoid duplicate entry on update', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .post('/api/status')
        .send({name:'name1', description:'description1'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus1 = await Status.findOne({name:'name1'});
        await loggedInRequest
        .put(`/api/status/${newStatus1._id}`)
        .send({name:newStatus.name, description:newStatus.description})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Status name already exists.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description already exists.')===false) throw new Error('Test case failed.');
        })
    });
    it('Error if empty or incomplete fields on update', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .put(`/api/status/${newStatus._id}`)
        .send({name:'', description:''})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Status name is required.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is required.')===false) throw new Error('Test case failed.');
        })
    });
    it('Error if incomplete fields on update', async function(){
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .put(`/api/status/${newStatus._id}`)
        .send({name:'a', description:'abc'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No status has one letter...')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is too short...')===false) throw new Error('Test case failed.');
        })
    });
    it('Error if status id on url does not exist.', async function(){
        await loggedInRequest
        .put(`/api/status/0123456789ab`)
        .send({name:'someName', description:'someDescription'})
        .expect(400)
        .expect(['Cannot find status.'])
    });
    it('Error on invalid status id on url.', async function(){
        await loggedInRequest
        .put(`/api/status/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
        await loggedInRequest
        .put(`/api/type/        `)
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