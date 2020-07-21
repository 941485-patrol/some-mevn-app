var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const mongoose = require('mongoose');

describe('Delete Animal', function(){
    it('Delete an animal', async function(){
        await request(app)
            .post('/api/type')
            .send({name:'name', environment:'environment'})
            .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/animal')
            .send({name:'myname', description:'mydescription', type_id: newType._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await request(app)
            .delete(`/api/animal/${newAnimal._id}`)
            .expect(200)
            .expect({'message': 'Animal deleted.'})
        await request(app)
        .get(`/api/type/${newType.id}`)
        .expect((err, res)=>{
            if (err) throw err;
            var animal_ids = res.animal_ids;
            if (animal.ids.length > 0) {
                animal_ids.forEach(animal => {
                    if (animal._id === newAnimal._id) throw new Error('Test case failed.');
                });
            }
        });
        await Type.deleteMany();
        await Type.deleteMany();
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