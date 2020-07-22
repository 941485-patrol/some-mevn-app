var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');
const mongoose = require('mongoose');

describe('Delete Animal', function(){
    before(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    it('Delete an animal', async function(){
        await request(app)
            .post('/api/type')
            .send({name:'name', environment:'environment'})
            .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/status')
            .send({name:'name', description:'mydescription'})
            .expect(200)
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
            .post('/api/animal')
            .send({name:'myname', description:'mydescription', type_id: newType._id, status_id: newStatus._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await request(app)
            .delete(`/api/animal/${newAnimal._id}`)
            .expect(200)
            .expect({'message': 'Animal deleted.'})
        await request(app)
        .get(`/api/type/${newType._id}`)
        .expect((res, err)=>{
            if (err) throw err;
            var animal_ids = res.body.animals;
            if (animal_ids.length > 0) {
                animal_ids.forEach(animal => {
                    if (animal._id === newAnimal._id) throw new Error('Test case failed.');
                });
            }
        })
        await request(app)
        .get(`/api/status/${newStatus._id}`)
        .expect((res, err)=>{
            if (err) throw err;
            var animal_ids = res.body.animals;
            if (animal_ids.length > 0) {
                animal_ids.forEach(animal => {
                    if (animal._id === newAnimal._id) throw new Error('Test case failed.');
                });
            }
        })
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });

    it('Error if wrong type id in url', async function(){
        await request(app)
            .delete(`/api/animal/0123456789ab`)
            .expect(400)
            .expect(['Error deleting data.'])
    });

    it('Error if empty or whitespace type id', async function(){
        await request(app)
            .delete(`/api/animal/`)
            .expect(404)
        await request(app)
            .delete(`/api/animal/    `)
            .expect(404)
    });
});