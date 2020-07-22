
//const Helper = require('./helpers');
//const helper = new Helper();

const app = require('../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

beforeAll(async () => {
    console.log('initial for all testing..')
});

afterAll(async () => {
    console.log('afterAll for all testing..'); 
    //await helper.teardown()
});

describe('User Endpoints', () => {
    it('should get all users', async () => {
        const res  = await request
            .get('api/user');
            expect(res.statusCode).toEqual(200)

    });
});

/*
describe('User Endpoints', () => {
    it('should get all users', async () => {
      const res = await request(app);
          request(app)
            .get('/api/user')
           // .expect(200)
            .end(function(err, res) {
              if (err) throw err;
            });
            console.log(res.statusCode);
            expect(res.statusCode).toEqual(200)
    });
});
*/

