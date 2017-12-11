const supertest = require('supertest');
const expect = require('chai').expect;

const relay = require('./'); // baton-request-relay

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3000';
const client = supertest(endpoint);

const EXCLUDE_HEADERS = ['date'];

describe('request-relay', () => {

  relay(`${__dirname}/fixtures/www.google.com`).forEach(rec => {
    it(`${rec.filename} (${rec.name})`, () => {
      // console.log(test);
      return supertest('www.google.com')[rec.request.method](rec.request.path)
        .set(rec.request.headers)
        .send(rec.request.body)

        .expect(rec.response.statusCode)
        .expect(rec.response.body)
        .expect((res) => {
          Object.keys(rec.response.headers)
            .forEach(key => {
              if (EXCLUDE_HEADERS.indexOf(key) === -1) {
                expect(key + ':' + res.headers[key]).to.equal(key + ':' + rec.response.headers[key])
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

  it('should process single file', () => {
    const rec = relay(`${__dirname}/fixtures/www.google.com/151193623843133264`);

    return supertest('www.google.com')[rec.request.method](rec.request.path)
      .set(rec.request.headers)
      .send(rec.request.body)

      .expect(rec.response.statusCode)
      .expect(rec.response.body)
      ;
  });
});
