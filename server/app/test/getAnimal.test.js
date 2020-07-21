var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');

describe('Get Animal', function(){
    it('Get one animal', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description: 'mydescription', type_id: newType._id})
        .expect(200)
        .expect({"message": "Animal created"});
        var newAnimal = await Animal.findOne({name: 'myname'});
        await request(app)
        .get(`/api/animal/${newAnimal._id}`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body._id != newAnimal._id) throw new Error('Test case failed');
        })
        await Type.deleteMany();
        await Animal.deleteMany();
    });
    it('Get all animals', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description: 'mydescription', type_id: newType._id})
        .expect(200)
        .expect({"message": "Animal created"});
        await request(app)
        .post('/api/animal')
        .send({name:'myOthername', description: 'myOtherdescription', type_id: newType._id})
        .expect(200)
        .expect({"message": "Animal created"});
        await request(app)
        .get('/api/animal/')
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.length != 2) throw new Error('Test case failed');
        });
        await Type.deleteMany();
        await Animal.deleteMany();
    });
    it('No data message if there is no animal inserted', async function(){
        await request(app)
        .get(`/api/animal`)
        .expect(200)
        .expect({'message': 'No data.'})
    })
    it('Error on invalid url', async function(){
        await request(app)
        .get(`/api/animal/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });
    it('Error if animal id does not exist', async function(){
        await request(app)
        .get(`/api/animal/0123456789ab`)
        .expect(400)
        .expect(['Cannot find animal.'])
    });
});