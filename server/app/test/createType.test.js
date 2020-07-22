var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');

describe('Create Type', function(){
    before(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    it('Create a Type', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        await Type.deleteMany();
    })

    it('Empty fields validation', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'', environment:''})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type name is required.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Environment of animal is required.')===false) throw new Error('Test case failed.');
        })
        await Type.deleteMany();
    })

    it('Incomplete fields validation', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'a', environment:'abcd'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No type has one letter...')===false) throw new Error('Test case failed.');
            if (res.body.includes('No environment has one letter...')===false) throw new Error('Test case failed.');
        })
        await Type.deleteMany();
    })

});