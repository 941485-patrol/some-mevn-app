var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Animal = require('../models/animal');
const Type = require('../models/type');

describe('Create Status', function(){
    before(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    it('Create a Status', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'name', description:'description'})
        .expect(200)
        .expect({'message': 'Status created.'})
        await Status.deleteMany();
    })

    it('Empty fields validation', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'', description:''})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Status name is required.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is required.')===false) throw new Error('Test case failed.');
        })
        await Status.deleteMany();
    })

    it('Incomplete fields validation', async function(){
        await request(app)
        .post('/api/status')
        .send({name:'a', description:'abcd'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No status has one letter...')===false) throw new Error('Test case failed.');
            if (res.body.includes('Status description is too short...')===false) throw new Error('Test case failed.');
        })
        await Status.deleteMany();
    })
});