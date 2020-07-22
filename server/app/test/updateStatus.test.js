var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');

describe('Update Status', function(){
    before(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    it('Update a Status', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
        .put(`/api/status/${newStatus._id}`)
        .send({name:'name1', description:'description1'})
        .expect(301)
        await Status.deleteMany();
    });
    it('Avoid duplicate entry on update', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
        .post('/api/status')
        .send({name:'name1', description:'description1'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus1 = await Status.findOne({name:'name1'});
        await request(app)
        .put(`/api/status/${newStatus1._id}`)
        .send({name:newStatus.name, description:newStatus.description})
        .expect(400)
        .expect((res, err)=>{
            console.log()
            if (err) throw err;
            if (res.body.includes('Status name already exists.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description already exists.')===false) throw new Error('Test case failed.');
        })
        await Status.deleteMany();
    });
    it('Error if empty or incomplete fields on update', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
        .put(`/api/status/${newStatus._id}`)
        .send({name:'', description:''})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Status name is required.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is required.')===false) throw new Error('Test case failed.');
        })
        await Status.deleteMany();
    });
    it('Error if incomplete fields on update', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
        .put(`/api/status/${newStatus._id}`)
        .send({name:'a', description:'abc'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No status has one letter...')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is too short...')===false) throw new Error('Test case failed.');
        })
        await Status.deleteMany()
    });
    it('Error if status id on url does not exist.', async function(){
        await request(app)
        .put(`/api/status/0123456789ab`)
        .send({name:'someName', description:'someDescription'})
        .expect(400)
        .expect(['Cannot find status.'])
    });
    it('Error on invalid status id on url.', async function(){
        await request(app)
        .put(`/api/status/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
        await request(app)
        .put(`/api/type/        `)
        .expect(404)
    });
});