var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Get Animal', function(){
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
    it('Get one animal', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'mydescription'})
        .expect(200)
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .post('/api/animal')
        .send({name:'myname', description: 'mydescription', type_id: newType._id, status_id: newStatus._id})
        .expect(200)
        .expect({"message": "Animal created"});
        var newAnimal = await Animal.findOne({name: 'myname'});
        await loggedInRequest
        .get(`/api/animal/${newAnimal._id}`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body._id != newAnimal._id) throw new Error('Test case failed');
        })
    });
    it('Get all animals', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .post('/api/status')
        .send({name:'name', description:'mydescription'})
        .expect(200)
        var newStatus = await Status.findOne({name:'name'});
        await loggedInRequest
        .post('/api/animal')
        .send({name:'myname', description: 'mydescription', type_id: newType._id, status_id: newStatus._id})
        .expect(200)
        .expect({"message": "Animal created"});
        await loggedInRequest
        .post('/api/animal')
        .send({name:'myOthername', description: 'myOtherdescription', type_id: newType._id, status_id: newStatus._id})
        .expect(200)
        .expect({"message": "Animal created"});
        await loggedInRequest
        .get('/api/animal/')
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.length != 2) throw new Error('Test case failed');
        });
    });
    it('No data message if there is no animal inserted', async function(){
        await loggedInRequest
        .get(`/api/animal`)
        .expect(200)
        .expect({'message': 'No data.'})
    })
    it('Error on invalid url', async function(){
        await loggedInRequest
        .get(`/api/animal/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if animal id does not exist', async function(){
        await loggedInRequest
        .get(`/api/animal/0123456789ab`)
        .expect(400)
        .expect(['Cannot find animal.'])
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