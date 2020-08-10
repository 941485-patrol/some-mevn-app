var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Update Type', function(){
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
    it('Update a Type', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .put(`/api/type/${newType._id}`)
        .send({name:'newName', environment:'newEnvironment'})
        .expect(301)
    });
    it('Avoid duplicate entry on update', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .post('/api/type')
        .send({name:'anotherName', environment:'anotherEnvironment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType1 = await Type.findOne({name:'anotherName'});
        await loggedInRequest
        .put(`/api/type/${newType1._id}`)
        .send({name:newType.name, environment:newType.environment})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type name already exists.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Type environment already exists.')===false) throw new Error('Test case failed.');
        })
    });
    it('Error if empty or incomplete fields on update', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .put(`/api/type/${newType._id}`)
        .send({name:'', environment:''})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type name is required.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Environment of animal is required.')===false) throw new Error('Test case failed.');
        })
    });
    it('Error if incomplete fields on update', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .put(`/api/type/${newType._id}`)
        .send({name:'a', environment:'abc'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No type has one letter...')===false) throw new Error('Test case failed.');
            if (res.body.includes('No environment has one letter...')===false) throw new Error('Test case failed.');
        })
    });
    it('Error if type id does not exist.', async function(){
        await loggedInRequest
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await loggedInRequest
        .put(`/api/type/0123456789ab`)
        .send({name:newType.name, environment:newType.environment})
        .expect(400)
        .expect(['Cannot find type.'])
    });
    it('Error on invalid type id on url.', async function(){
        await loggedInRequest
        .put(`/api/type/invalid_url`)
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