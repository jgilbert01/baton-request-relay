const supertest = require('supertest');
const expect = require('chai').expect;

const relay = require('./'); // baton-request-relay

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3000';
const client = supertest(endpoint);

const EXCLUDE_HEADERS = ['date'];

describe('request-relay', () => {

  relay(`${__dirname}/fixtures/www.google.com`).forEach(test => {
    it(test.name, () => {
      // console.log(test);
      return supertest('www.google.com')[test.request.method](test.request.path)
        .set(test.request.headers)
        .send(test.request.body)

        .expect(test.response.statusCode)
        .expect(test.response.body)
        .expect((res) => {
          Object.keys(test.response.headers)
            .forEach(key => {
              if (EXCLUDE_HEADERS.indexOf(key) === -1) {
                expect(key + ':' + res.headers[key]).to.equal(key + ':' + test.response.headers[key])
              } else {
                // console.log('skipping header: ', key);
              }
            })
        })

        .then((res) => {
            console.log(res);
        })
        ;
      // return test.run()
      //   .then((res) => {
      //     // console.log(res);
      //   })
      //   ;
    });
  });
});
