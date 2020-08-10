var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;
const mongoose = require('mongoose');

describe('Update Animal', function(){
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
    it('Update an animal', async function(){
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
            .send({name:'myname', description:'mydescription', type_id: newType._id, status_id: newStatus._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:'mynewname', description:'mynewdescription', type_id:newAnimal.type_id, status_id:newAnimal.status_id})
            .expect(301)
    });

    it('Error on post url or whitespace url', async function(){
        await loggedInRequest
        .put('/api/animal/    ')
        .expect(404)
    });

    it('Cannot find animal id on animal update', async function(){
        await loggedInRequest
        .put(`/api/animal/0123456789ab`)
        .expect(400)
        .expect(['Cannot find animal'])
    });

    it('Invalid url on animal update', async function(){
        await loggedInRequest
        .put(`/api/animal/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });

    it('Existing records on update validation', async function(){
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
            .send({name:'myname', description:'mydescription', type_id: newType._id, status_id: newStatus._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await loggedInRequest
            .post('/api/animal')
            .send({name:'myothername', description:'myotherdescription', type_id: newType._id, status_id: newStatus._id})
            .expect(200)
        var newAnimal1 = await Animal.findOne({name: 'myothername'});
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal1.name, description:newAnimal1.description, type_id:newAnimal1.type_id, status_id: newAnimal1.status_id})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Animal name already exists.')==false) throw new Error('Test case failed.');
                if (res.body.includes('Animal description already exists.')==false) throw new Error('Test case failed.');
            })
    });

    it('Empty and uncomplete fields on update validation', async function(){
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
            .send({name:'myname', description:'mydescription', type_id: newType._id, status_id: newStatus._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:'', 
                description:'', 
                type_id:newAnimal.type_id, status_id: newAnimal.status_id})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Animal name is required.')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Animal description is required.')===false) throw new Error('Test case has failed.');
            })
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:'n', 
                description:'des', 
                type_id:newAnimal.type_id, status_id: newAnimal.status_id})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('No animal has one letter...')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Description is too short...')===false) throw new Error('Test case has failed.');
            })
    })
    
    it('Type id validation', async function(){
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
            .send({name:'myname', description:'mydescription', type_id: newType._id, status_id: newStatus._id})
            .expect(200)
        var newAnimal = await Animal.findOne({type_id: newType._id});
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:'', status_id:'0123456789ab'})
            .expect(400)
            .expect(['Invalid Type ID.'])
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:'0123456789ab', status_id:''})
            .expect(400)
            .expect(['Invalid Status ID.'])
            await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:'12345', status_id:'0123456789ab'})
            .expect(400)
            .expect(['Invalid Type ID.'])
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:'0123456789ab', status_id:'12345'})
            .expect(400)
            .expect(['Invalid Status ID.'])
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:'0123456789ab', status_id:'0123456789ab'})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Type ID does not exist.')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Status ID does not exist.')===false) throw new Error('Test case has failed.');
            });
        await loggedInRequest
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:null, status_id:null})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Type ID does not exist.')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Status ID does not exist.')===false) throw new Error('Test case has failed.');
            });
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
})