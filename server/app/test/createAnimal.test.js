var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const Status = require('../models/status');

describe('Create Animal', function(){
    before(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    it('Create an animal', async function(){
        await request(app)
            .post('/api/type')
            .send({name:'name', environment:'environment'})
            .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/status')
            .send({name:'name', description:'description'})
            .expect(200)
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
            .post('/api/animal')
            .send({name:'myname', description: 'mydescription', type_id: newType._id, status_id: newStatus._id})
            .expect({"message": "Animal created"});
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
    
    it('Type id not found validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'0123456789ab', status_id:'0123456789ab'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type ID does not exist.')===false) throw new Error('Test case has failed.');
            if (res.body.includes('Status ID does not exist.')===false) throw new Error('Test case has failed.');
        });
    });

    it('Nulltype Type/Status id validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:null, status_id:'0123456789ab'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type ID does not exist.')===false) throw new Error('Test case has failed.');
            if (res.body.includes('Status ID does not exist.')===false) throw new Error('Test case has failed.');
        });
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'0123456789ab', status_id:null})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Type ID does not exist.')===false) throw new Error('Test case has failed.');
            if (res.body.includes('Status ID does not exist.')===false) throw new Error('Test case has failed.');
        });
    });

    it('Empty string Type/Status id validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'', status_id:'0123456789ab'})
        .expect(400)
        .expect(["Invalid Type ID."])
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'0123456789ab', status_id:''})
        .expect(400)
        .expect(["Invalid Status ID."])
    });

    it('Invalid Type/Status id validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'invalid_mongoose_object_id' , status_id:'0123456789ab'})
        .expect(400)
        .expect(["Invalid Type ID."])
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'0123456789ab' , status_id:'invalid_mongoose_object_id'})
        .expect(400)
        .expect(["Invalid Status ID."])
    });

    it('Min/Max length validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'m', description:'abcd', type_id:'0123456789ab', status_id:'0123456789ab'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('No animal has one letter...')===false) throw new Error('Test case has failed.');
            if (res.body.includes('Description is too short...')===false) throw new Error('Test case has failed.');
        })
    });

    it('Nulltype/empty string field validtion', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:null, description:'', type_id:'0123456789ab', status_id:'0123456789ab'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Animal name is required.')===false) throw new Error('Test case has failed.');
            if (res.body.includes('Animal description is required.')===false) throw new Error('Test case has failed.');
        })
    })

    it('Avoid duplicate entry', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/status')
            .send({name:'name', description:'description'})
            .expect(200)
        var newStatus = await Status.findOne({name:'name'});
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id: newType._id, status_id: newStatus._id})
        .expect(200)
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id: newType._id, status_id: newStatus._id})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Animal name already exists.')==false) throw new Error('Test case failed.');
            if (res.body.includes('Animal description already exists.')==false) throw new Error('Test case failed.');
        })
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
    });
})