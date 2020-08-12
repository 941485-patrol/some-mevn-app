var app = require('../testServer');
const request = require('supertest');
const Status = require('../models/status');
const Type = require('../models/type');
const Animal = require('../models/animal');
const User = require('../models/user');
const session = require('supertest-session');
var testRequest = null;

describe('Get Statuses', function(){
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
            {name:'name4', description:'description4'},
            {name:'name5', description:'description5'},
            {name:'name6', description:'description6'},
            {name:'name7', description:'description7'},
            {name:'name8', description:'description8'},
            {name:'name9', description:'description9'},
            {name:'name10', description:'description10'},
            {name:'name11', description:'description11'},
            {name:'name12', description:'description12'},
        ]);
    });
    it('Get all statuses', async function(){
        await loggedInRequest
        .get(`/api/status`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.hasPrev != false) throw new Error('Page 1 must be hasPrev false');
            if (res.body.hasNext != true) throw new Error('Page 1 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/status/?page=2`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.hasPrev != true) throw new Error('Page 2 must be hasPrev true');
            if (res.body.hasNext != true) throw new Error('Page 2 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/status/?page=3`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.hasPrev != true) throw new Error('Page 3 must be hasPrev true');
            if (res.body.hasNext != false) throw new Error('Page 3 must be hasNext false');
            if (res.body.results.length != 2) throw new Error('Results must be two');
        })
        await loggedInRequest
        .get(`/api/status/?page=4`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results.message != 'No data.') throw new Error ('Should be "No data."');
        })
    });
    it('Sort statuses', async function(){
        await loggedInRequest
        .get(`/api/status/?sort=-name`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results[0].name!='name9') throw new Error('Must be name9.');
            if (res.body.hasPrev != false) throw new Error('Page 1 must be hasPrev false');
            if (res.body.hasNext != true) throw new Error('Page 1 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/status/?page=2&sort=-name`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results[4].name!='name11') throw new Error('Must be name11.');
            if (res.body.hasPrev != true) throw new Error('Page 2 must be hasPrev true');
            if (res.body.hasNext != true) throw new Error('Page 1 must be hasNext true');
            if (res.body.results.length != 5) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/status/?sort=-name&page=3`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name10') throw new Error('Must be name10');
            if (res.body.hasPrev != true) throw new Error('Page 3 must be hasPrev true');
            if (res.body.hasNext != false) throw new Error('Page 3 must be hasNext true');
            if (res.body.results.length != 2) throw new Error('Results must be five');
        })
        await loggedInRequest
        .get(`/api/status/?sort=-name&page=4`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results.message != 'No data.') throw new Error ('Should be "No data."');
        })
    });
    it('Search statuses', async function(){
        await loggedInRequest
        .get(`/api/status/?s=name5`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name5') throw new Error('Must be name5');
        })
        await loggedInRequest
        .get(`/api/status/?s=nAmE5`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name5') throw new Error('Must be name5');
        })
    });
    it('Search statuses with sort and pagination', async function(){
        await loggedInRequest
        .get(`/api/status/?sort=-name&s=nam&page=2`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name4') throw new Error('Must be name4');
        })
        await loggedInRequest
        .get(`/api/status/?s=nAm&page=3&sort=name`)
        .expect(200)
        .expect((res,err)=>{
            if (err) throw err;
            if (res.body.results[0].name !='name8') throw new Error('Must be name8');
        })
    });
    it('No data message if there is no status inserted', async function(){
        await Status.deleteMany();
        await loggedInRequest
        .get(`/api/status`)
        .expect(200)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.results.message != 'No data.') throw new Error ('Should be "No data."');
        })
    });
    it('Paging error', async function(){
        await loggedInRequest
        .get(`/api/status/?page=two`)
        .expect(400)
        .expect(['Page must be a number.'])
        await loggedInRequest
        .get(`/api/status/?page=0`)
        .expect(400)
        .expect(['Page must be not less than 1.'])
        await loggedInRequest
        .get(`/api/status/?page=-2340`)
        .expect(400)
        .expect(['Page must be not less than 1.'])
    });
    it('Sorting error', async function(){
        await loggedInRequest
        .get(`/api/status/?sort=namek`)
        .expect(400)
        .expect(['Invalid sort field.'])
        await loggedInRequest
        .get(`/api/status/?sort=-descriptor`)
        .expect(400)
        .expect(['Invalid sort field.'])
        await loggedInRequest
        .get(`/api/status/?sort=__id`)
        .expect(400)
        .expect(['Invalid sort field.'])
    });
    it('Sorting and paging error', async function(){
        await loggedInRequest
        .get(`/api/status/?sort=namek&page=2`)
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Invalid sort field.')==false) throw new Error ('Must have sorting error msg');
            // if (res.body.includes('Page must be a number.')==false) throw new Error ('Must have paging error msg');
        })
        await loggedInRequest
        .get(`/api/status/?sort=-descriptore&page=negativeOne`)
        .expect(400)
        .expect((res, err)=>{
            if (err) throw err;
            if (res.body.includes('Page must be a number.')==false) throw new Error ('Must have paging error msg');
        })
        await loggedInRequest
        .get(`/api/status/?page=0&sort=__id`)
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