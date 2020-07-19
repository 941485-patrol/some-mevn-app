var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');
const mongoose = require('mongoose');

describe('Update Animal', function(){
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
            .expect(['Animal name already exists.', 'Animal description already exists.']);
        await Type.deleteOne({_id: newType._id});
        await Animal.deleteMany({type_id: newType._id});
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
            .expect(['Animal name is required.', 'Animal description is required.']);
        await request(app)
            .put(`/api/animal/${newAnimal._id}`)
            .send({name:'n', 
                description:'des', 
                type_id:newAnimal.type_id})
            .expect(400)
            .expect(['No animal has one letter...', 'Description is too short...']);
        await Type.deleteOne({_id: newType._id});
        await Animal.deleteMany({type_id: newType._id});
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

    // it('Invalid type id on url update', async function(){
    //     var type = new Type({
    //         name: 'myname',
    //         environment:'myenvironment'
    //     })
    //     var newType = await type.save();
    //     var newTypeId = newType._id;
    //     var animal = new Animal({
    //         name:'myname',
    //         description:'mydescription',
    //         type_id: newTypeId
    //     })
    //     var newAnimal = await animal.save();
    //     var newAnimalId = newAnimal._id;
    //     await request(app)
    //     .put(`/api/animal/${newAnimalId}`)
    //     .send({name: newAnimal.name, 
    //         description: newAnimal.description, 
    //         type_id:'invalid_type_id'})
    //     .expect(400)
    //     .expect(['Invalid Type ID.'])
    //     await Animal.deleteOne({_id: newAnimalId});
    //     await Type.deleteOne({_id: newTypeId});
    // });
})