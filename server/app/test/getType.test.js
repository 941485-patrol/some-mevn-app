var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');

describe('Get Type', function(){
    it('Get one type', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .get(`/api/type/${newType._id}`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body._id != newType._id) throw new Error('Test case failed');
        })
        await Type.deleteMany();
    });
    it('Get all types', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        await request(app)
        .post('/api/type')
        .send({name:'anotherName', environment:'anotherEnvironment'})
        .expect(200)
        .expect({"message": "Type created"})
        await request(app)
        .get(`/api/type`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.length != 2) throw new Error('Test case failed');
        })
        await Type.deleteMany();
    });
    it('No data message if there is no type inserted', async function(){
        await request(app)
        .get(`/api/type`)
        .expect(200)
        .expect({'message': 'No data.'})
    })
    it('Error on invalid url', async function(){
        await request(app)
        .get(`/api/type/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if type id does not exist', async function(){
        await request(app)
        .get(`/api/type/0123456789ab`)
        .expect(400)
        .expect(['Cannot find type.'])
    });
});