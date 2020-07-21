var app = require('../testServer');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');

describe('Create Animal', function(){
    it('Create an animal', async function(){
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
        await Animal.deleteOne({_id: newAnimal._id});
        await Type.deleteOne({_id: newType._id});
    });
    
    it('Type id not found validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'0123456789ab'})
        .expect(400)
        .expect(['Type ID does not exist.']);
    });

    it('Nulltype Type id validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:null})
        .expect(400)
        .expect(['Type ID does not exist.']);
    });

    it('Empty string Type id validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:''})
        .expect(400)
        .expect(["Invalid Type ID."])
    });

    it('Invalid Type id validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'invalid_mongoose_object_id'})
        .expect(400)
        .expect(["Invalid Type ID."])
    });

    it('Min/Max length validation', async function(){
        await request(app)
        .post('/api/animal')
        .send({name:'m', description:'abcd', type_id:'0123456789ab'})
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
        .send({name:null, description:'', type_id:'0123456789ab'})
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Animal name is required.')===false) throw new Error('Test case has failed.');
            if (res.body.includes('Animal description is required.')===false) throw new Error('Test case has failed.');
        })
    })

    it('Avoid duplicate entry', async function(){
        try {
            var type = new Type({
                name: 'myname',
                environment:'myenvironment'
            })
            await type.save();
            var savedType = type._id;
            var animal = new Animal({
                name:'myname',
                description:'mydescription',
                type_id: type._id
            })
            await animal.save();
            var savedAnimal = animal._id;
            await request(app)
            .post('/api/animal')
            .send({name:'myname', description:'mydescription', type_id:type.type_id})
            .expect(400)
            .expect((res, err)=>{
                if (err) throw err;
                if (res.body.includes('Animal name already exists.')==false) throw new Error('Test case failed.');
                if (res.body.includes('Animal description already exists.')==false) throw new Error('Test case failed.');
            })
        } catch (error) {
            console.log(error);
        } finally {
            await Animal.deleteOne({_id:savedAnimal});
            await Type.deleteOne({_id:savedType});
        }
    });
})