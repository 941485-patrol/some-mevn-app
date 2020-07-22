var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');

describe('Get Status', function(){
    before(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    it('Get one status', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
        .get(`/api/status/${newStatus._id}`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body._id != newStatus._id) throw new Error('Test case failed');
        })
        await Status.deleteMany();
    });
    it('Get all statuses', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        await request(app)
        .post('/api/status')
        .send({name:'name1', description:'description1'})
        .expect(200)
        .expect({'message': 'Status created.'})
        await request(app)
        .get(`/api/status`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.length != 2) throw new Error('Test case failed');
        })
        await Status.deleteMany();
    });
    it('No data message if there is no status inserted', async function(){
        await request(app)
        .get(`/api/status`)
        .expect(200)
        .expect({'message': 'No data.'})
    })
    it('Error on invalid url', async function(){
        await request(app)
        .get(`/api/status/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if status id does not exist', async function(){
        await request(app)
        .get(`/api/status/0123456789ab`)
        .expect(400)
        .expect(['Cannot find status.'])
    });
});