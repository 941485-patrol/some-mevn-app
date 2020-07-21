var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const mongoose = require('mongoose');

describe('Delete Type', function(){
    it('Delete a Type', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .delete(`/api/type/${newType._id}`)
        .expect(200)
        .expect({'message': 'Type deleted.'})
    });
    it('Error on invalid type id url', async function(){
        await request(app)
        .delete(`/api/type/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if type id not found', async function(){
        await request(app)
        .delete(`/api/type/0123456789ab`)
        .expect(400)
        .expect(['Error deleting data.'])
    });
    it('Error if empty type id', async function(){
        await request(app)
        .delete(`/api/type/`)
        .expect(404)
    });
});