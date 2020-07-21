var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const mongoose = require('mongoose');

describe('Update Animal', function(){
    it('Update an animal', async function(){
        await request(app)
            .post('/api/type')
            .send({name:'name', environment:'environment'})
            .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/animal')
            .send({name:'myname', description:'mydescription', type_id: newType._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:'mynewname', 
                description:'mynewdescription',
                type_id:newAnimal.type_id})
            .expect(301)
        await Animal.deleteOne({_id: newAnimal._id});
        await Type.deleteOne({_id: newType._id});
    });

    it('Error on post url or whitespace url', async function(){
        await request(app)
        .put('/api/animal/    ')
        .expect(404)
    });

    it('Cannot find animal id on animal update', async function(){
        await request(app)
        .put(`/api/animal/0123456789ab`)
        .expect(400)
        .expect(['Cannot find animal'])
    });

    it('Invalid url on animal update', async function(){
        await request(app)
        .put(`/api/animal/invalid_url`)
        .expect(400)
        .expect(['Invalid Url.'])
    });

    it('Existing records on update validation', async function(){
        await request(app)
        .post('/api/type')
        .send({name:'name', environment:'environment'})
        .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/animal')
            .send({name:'myname', description:'mydescription', type_id: newType._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await request(app)
            .post('/api/animal')
            .send({name:'myothername', description:'myotherdescription', type_id: newType._id})
            .expect(200)
        var newAnimal1 = await Animal.findOne({name: 'myothername'});
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal1.name, 
                description:newAnimal1.description, 
                type_id:newAnimal1.type_id})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Animal name already exists.')==false) throw new Error('Test case failed.');
                if (res.body.includes('Animal description already exists.')==false) throw new Error('Test case failed.');
            })
        await Type.deleteOne({_id: newType._id});
        await Animal.deleteMany();
    });

    it('Empty and uncomplete fields on update validation', async function(){
        await request(app)
            .post('/api/type')
            .send({name:'name', environment:'environment'})
            .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/animal')
            .send({name:'myname', description:'mydescription', type_id: newType._id})
            .expect(200)
        var newAnimal = await Animal.findOne({name: 'myname'});
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:'', 
                description:'', 
                type_id:newAnimal.type_id})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Animal name is required.')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Animal description is required.')===false) throw new Error('Test case has failed.');
            })
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:'n', 
                description:'des', 
                type_id:newAnimal.type_id})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('No animal has one letter...')===false) throw new Error('Test case has failed.');
                if (res.body.includes('Description is too short...')===false) throw new Error('Test case has failed.');
            })
        await Type.deleteOne({_id: newType._id});
        await Animal.deleteOne({_id: newAnimal._id});
    })
    
    it('Type id validation', async function(){
        await request(app)
            .post('/api/type')
            .send({name:'name', environment:'environment'})
            .expect(200)
        var newType = await Type.findOne({name:'name'});
        await request(app)
            .post('/api/animal')
            .send({name:'myname', description:'mydescription', type_id: newType._id})
            .expect(200)
        var newAnimal = await Animal.findOne({type_id: newType._id});
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:''})
            .expect(400)
            .expect(['Invalid Type ID.']);
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:'12345'})
            .expect(400)
            .expect(['Invalid Type ID.']);
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:null})
            .expect(400)
            .expect(['Type ID does not exist.']);
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:newAnimal.name, 
                description:newAnimal.description, 
                type_id:'0123456789ab'})
            .expect(400)
            .expect(['Type ID does not exist.']);
        await Animal.deleteOne({_id: newAnimal._id});
        await Type.deleteOne({_id: newType._id});
    });
})