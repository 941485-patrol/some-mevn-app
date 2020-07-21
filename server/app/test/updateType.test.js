var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');

describe('Update Type', function(){
    it('Update a Type', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .put(`/api/type/${newType._id}`)
        .send({name:'newName', environment:'newEnvironment'})
        .expect(301)
        await Type.deleteMany();
    });
    it('Avoid duplicate entry on update', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .post('/api/type')
        .send({name:'anotherName', environment:'anotherEnvironment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType1 = await Type.findOne({name:'anotherName'});
        await request(app)
        .put(`/api/type/${newType1._id}`)
        .send({name:newType.name, environment:newType.environment})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type name already exists.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Type environment already exists.')===false) throw new Error('Test case failed.');
        })
        await Type.deleteMany();
    });
    it('Error if empty or incomplete fields on update', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .put(`/api/type/${newType._id}`)
        .send({name:'', environment:''})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type name is required.')===false) throw new Error('Test case failed.');
            if (res.body.includes('Environment of animal is required.')===false) throw new Error('Test case failed.');
        })
        await Type.deleteMany();
    });
    it('Error if incomplete fields on update', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .put(`/api/type/${newType._id}`)
        .send({name:'a', environment:'abc'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No type has one letter...')===false) throw new Error('Test case failed.');
            if (res.body.includes('No environment has one letter...')===false) throw new Error('Test case failed.');
        })
        await Type.deleteMany()
    });
    it('Error if type id does not exist.', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        .expect({"message": "Type created"})
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .put(`/api/type/0123456789ab`)
        .send({name:newType.name, environment:newType.description})
        .expect(400)
        .expect(['Cannot find type.'])
        await Type.deleteMany()
    });
    it('Error on invalid type id on url.', async function(){
        await request(app)
        .put(`/api/type/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
        await request(app)
        .put(`/api/type/        `)
        .expect(404)
    });
});