var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');

describe('Delete Status', function(){
    before(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    it('Delete a Status', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
        .delete(`/api/status/${newStatus._id}`)
        .expect(200)
        .expect({'message': 'Status deleted.'})
    });
    it('Error on invalid type id url', async function(){
        await request(app)
        .delete(`/api/status/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if type id not found', async function(){
        await request(app)
        .delete(`/api/status/0123456789ab`)
        .expect(400)
        .expect(['Error deleting data.'])
    });
    it('Error if empty type id', async function(){
        await request(app)
        .delete(`/api/status/`)
        .expect(404)
    });
});