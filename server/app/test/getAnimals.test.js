var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Get Animals', function(){
    var loggedInRequest;
    beforeEach(async function(){
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
        testRequest = session(app);
        await testRequest
            .post('/api/user/register')
            .send({username:'username',password:'Password123',confirm:'Password123'})
            .expect(200)
        await testRequest
            .post('/api/user/login')
            .send({username:'username', password:'Password123'})
            .expect(200)
            .expect({"message": "You are now logged in."})
            .expect((res,err)=>{
                if (err) {throw err};
                loggedInRequest = testRequest; 
            })
        await Status.insertMany([
            {name:'name1', description:'description1'},
            {name:'name2', description:'description2'},
            {name:'name3', description:'description3'},
        ]);
        var status1 = await Status.findOne({name:'name1'});
        var status2 = await Status.findOne({name:'name2'});
        var status3 = await Status.findOne({name:'name3'});
        status1 = status1._id;
        status2 = status2._id;
        status3 = status3._id;
        await Type.insertMany([
            {name:'name1', environment:'environment1'},
            {name:'name2', environment:'environment2'},
            {name:'name3', environment:'environment3'},
        ]);
        var type1 = await Type.findOne({name:'name1'});
        var type2 = await Type.findOne({name:'name2'});
        var type3 = await Type.findOne({name:'name3'});
        type1 = type1._id;
        type2 = type2._id;
        type3 = type3._id;
        await Animal.insertMany([
            {name:'name1', description:'description1', status_id:status1, type_id:type2},
            {name:'name2', description:'description2', status_id:status3, type_id:type3},
            {name:'name3', description:'description3', status_id:status1, type_id:type2},
            {name:'name4', description:'description4', status_id:status2, type_id:type1},
            {name:'name5', description:'description5', status_id:status2, type_id:type3},
            {name:'name6', description:'description6', status_id:status1, type_id:type2},
            {name:'name7', description:'description7', status_id:status2, type_id:type1},
            {name:'name8', description:'description8', status_id:status2, type_id:type3},
            {name:'name9', description:'description9', status_id:status1, type_id:type2},
            {name:'name10', description:'description10', status_id:status2, type_id:type1},
            {name:'name11', description:'description11', status_id:status2, type_id:type2},
            {name:'name12', description:'description12', status_id:status3, type_id:type3},
        ]);
    });
    it('Get all animals', async function(){
        await loggedInRequest
        .get(`/api/animal`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.hasPrev != false) throw new Error('Page 1 must be hasPrev false');
            if (res.body.hasNext != true) throw new Error('Page 1 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/animal/?page=2`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.hasPrev != true) throw new Error('Page 2 must be hasPrev true');
            if (res.body.hasNext != true) throw new Error('Page 2 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/animal/?page=3`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.hasPrev != true) throw new Error('Page 3 must be hasPrev true');
            if (res.body.hasNext != false) throw new Error('Page 3 must be hasNext false');
            if (res.body.results.length != 2) throw new Error('Results must be two');
        })
        await loggedInRequest
        .get(`/api/animal/?page=4`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results.message != 'No data.') throw new Error ('Should be "No data."');
        })
    });
    it('Sort animals', async function(){
        await loggedInRequest
        .get(`/api/animal/?sort=-name`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results[0].name!='name9') throw new Error('Must be name9.');
            if (res.body.hasPrev != false) throw new Error('Page 1 must be hasPrev false');
            if (res.body.hasNext != true) throw new Error('Page 1 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/animal/?page=2&sort=-name`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results[4].name!='name11') throw new Error('Must be name11.');
            if (res.body.hasPrev != true) throw new Error('Page 2 must be hasPrev true');
            if (res.body.hasNext != true) throw new Error('Page 1 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/animal/?sort=-name&page=3`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name10') throw new Error('Must be name10');
            if (res.body.hasPrev != true) throw new Error('Page 3 must be hasPrev true');
            if (res.body.hasNext != false) throw new Error('Page 3 must be hasNext true');
            if (res.body.results.length != 2) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/animal/?sort=-name&page=4`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results.message != 'No data.') throw new Error ('Should be "No data."');
        })
    });
    it('Search animals', async function(){
        await loggedInRequest
        .get(`/api/animal/?s=name5`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name5') throw new Error('Must be name5');
        })
        await loggedInRequest
        .get(`/api/animal/?s=nAmE5`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name5') throw new Error('Must be name5');
        })
    });
    it('Search animals with sort and pagination', async function(){
        await loggedInRequest
        .get(`/api/animal/?sort=-name&s=nam&page=2`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name4') throw new Error('Must be name4');
        })
        await loggedInRequest
        .get(`/api/animal/?s=nAm&page=3&sort=name`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name8') throw new Error('Must be name8');
        })
    });
    it('No data message if there is no animals inserted', async function(){
        await Animal.deleteMany();
        await loggedInRequest
        .get(`/api/animal`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results.message != 'No data.') throw new Error ('Should be "No data."');
        })
    });
    it('Paging error', async function(){
        await loggedInRequest
        .get(`/api/animal/?page=two`)
        .expect(400)
        .expect(['Page must be a number.'])
        await loggedInRequest
        .get(`/api/animal/?page=0`)
        .expect(400)
        .expect(['Page must be not less than 1.'])
        await loggedInRequest
        .get(`/api/animal/?page=-2340`)
        .expect(400)
        .expect(['Page must be not less than 1.'])
    });
    it('Sorting error', async function(){
        await loggedInRequest
        .get(`/api/animal/?sort=namek`)
        .expect(400)
        .expect(['Invalid sort field.'])
        await loggedInRequest
        .get(`/api/animal/?sort=-descriptor`)
        .expect(400)
        .expect(['Invalid sort field.'])
        await loggedInRequest
        .get(`/api/animal/?sort=__id`)
        .expect(400)
        .expect(['Invalid sort field.'])
    });
    it('Sorting and paging error', async function(){
        await loggedInRequest
        .get(`/api/animal/?sort=namek&page=2`)
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Invalid sort field.')==false) throw new Error ('Must have sorting error msg');
            // if (res.body.includes('Page must be a number.')==false) throw new Error ('Must have paging error msg');
        })
        await loggedInRequest
        .get(`/api/animal/?sort=-descriptore&page=negativeOne`)
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Page must be a number.')==false) throw new Error ('Must have paging error msg');
        })
        await loggedInRequest
        .get(`/api/animal/?page=0&sort=__id`)
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Page must be not less than 1.')==false) throw new Error ('Must have paging error msg');
        })
    });
    afterEach(async function(){
        await loggedInRequest
            .get('/api/user/logout')
            .expect(200)
            .expect({"message":"You are now logged out."})
        await Type.deleteMany();
        await Animal.deleteMany();
        await Status.deleteMany();
        await User.deleteMany();
    });
});