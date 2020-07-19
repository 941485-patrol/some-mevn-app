var app = require('../server');
const request = require('supertest');
const Type = require('../models/type');
const Animal = require('../models/animal');

describe('Animal', function(){
    it('Type id not found validation', function(done){
        request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'0123456789ab'})
        // .send({name:'myname', description:'mydescription', type_id:null})
        .expect(400)
        .expect(['Type ID does not exist.'],done);
    });

    it('Nulltype Type id validation', function(done){
        request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:null})
        .expect(400)
        .expect(['Type ID does not exist.'],done);
    });

    it('Empty string Type id validation', function(done){
        request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:''})
        .expect(400)
        .expect(["Invalid Type ID."],done)
    });

    it('Invalid Type id validation', function(done){
        request(app)
        .post('/api/animal')
        .send({name:'myname', description:'mydescription', type_id:'invalid_mongoose_object_id'})
        .expect(400)
        .expect(["Invalid Type ID."],done)
    });

    it('Min/Max length validation', function(done){
        request(app)
        .post('/api/animal')
        .send({name:'m', description:'abcd', type_id:'0123456789ab'})
        .expect(400)
        .expect(['No animal has one letter...', 'Description is too short...', 'Type ID does not exist.'],done);
    });

    it('Nulltype/empty string field validtion', function(done){
        request(app)
        .post('/api/animal')
        .send({name:null, description:'', type_id:'0123456789ab'})
        .expect(400)
        .expect(['Animal name is required.', 'Animal description is required.', 'Type ID does not exist.'],done);
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
            .expect(['Animal name already exists.', 'Animal description already exists.']);
        } catch (error) {
            console.log(error);
        } finally {
            await Animal.deleteOne({_id:savedAnimal});
            await Type.deleteOne({_id:savedType});
        }
    });
})