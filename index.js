'use strict';

const fs = require('fs');
const Replay = require('replay');

class RequestTest {

  constructor(test) {
    Object.assign(this, test);
  }
}

const toRequest = (path, filename) => {
  const content = Replay.catalog._read(path);
  // console.log(path);
  // console.log(content);
  const t = {
    name: `${content.request.method} ${content.request.url}`,
    filename: filename,
    request: {
      path: content.request.url,
      method: content.request.method.toLowerCase(),
      headers: content.request.headers || {},
      body: content.request.body ? content.request.body.split('\\\"').join('\"') : undefined,
    },
    response: {
      statusCode: content.response.statusCode,
      headers: content.response.headers,
      body: content.response.body[0][0].toString('utf8')
    }
  };

  return new RequestTest(t);
}

module.exports = (path) => {
  const isDirectory = fs.lstatSync(path).isDirectory();
  if (isDirectory) {
    const filenames = fs.readdirSync(path);
    return filenames.map(filename => toRequest(path + '/' + filename, filename));
  } else {
    return toRequest(path);
  }
}
