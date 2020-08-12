var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const mongoose = require('mongoose');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Delete Animal', function(){
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
    it('Delete an animal', async function(){
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
            .delete(`/api/animal/${newAnimal._id}`)
            .expect(200)
            .expect({'message': 'Animal deleted.'})
        await loggedInRequest
            .post('/api/animal')
            .send({name:'myname2', description:'mydescription2', type_id: newType._id, status_id: newStatus._id})
            .expect(200)
        await loggedInRequest
        .get(`/api/type/${newType._id}`)
        .expect((res, err)=>{
            if (err) throw err;
            var animals = res.body.animals;
            if (animals.length > 0) {
                animals.forEach(animal => {
                    if (animal.animal_id == newAnimal._id) throw new Error('Animal id must be pulled.');
                });
            }
        })
        await loggedInRequest
        .get(`/api/status/${newStatus._id}`)
        .expect((res, err)=>{
            if (err) throw err;
            var animals = res.body.animals;
            if (animals.length > 0) {
                animals.forEach(animal => {
                    if (animal.animal_id === newAnimal._id) throw new Error('Animal id must be pulled 2.');
                });
            }
        })
    });

    it('Error if wrong type id in url', async function(){
        await loggedInRequest
            .delete(`/api/animal/0123456789ab`)
            .expect(400)
            .expect(['Error deleting data.'])
    });

    it('Error if empty or whitespace type id', async function(){
        await loggedInRequest
            .delete(`/api/animal/`)
            .expect(404)
        await loggedInRequest
            .delete(`/api/animal/    `)
            .expect(404)
    });
    
    afterEach(async function(){
        await loggedInRequest
            .get('/api/user/logout')
            .expect(200)
            .expect({"message":"You are now logged out."})
        await User.deleteMany();
    });
});