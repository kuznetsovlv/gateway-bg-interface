import { createServer } from 'node:http';

import DataProducerInterface from './DataProducerInterface';

export { DataProducerInterface };

/**
 * @typedef {'GET'|'POST'|'PUT'|'DELETE'} Method
 */

/**
 * @typedef {Object} ParsedRequest
 * @property {string} path
 * @property {Method} method
 * @property {Object|*[]} data
 */

export default class Server {
  /**
   * @param {DataProducerInterface} dataProducer
   * @param {number} [port = 8000]
   */
  constructor(dataProducer = new DataProducerInterface(), port = 8000) {
    this.$dataProducer = dataProducer;
    this.$port = port;

    this.$main = this.$main.bind(this);
    this.$parseRequest = this.$parseRequest.bind(this);
    this.start = this.start.bind(this);
  }

  /**
   * @private
   * @param  req
   * @param  res
   */
  $main(req, res) {
    this.$parseRequest(req).then(console.log, console.log);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: 'Hello World!'
      })
    );
  }

  /**
   * @private
   * @param req
   * @return Promise<ParsedRequest>
   */
  async $parseRequest(req) {
    return new Promise((resolve, reject) => {
      /**
       * @type {Method}
       */
      const method = req.method;
      const url = req.url;

      const [path = '', queryString] = url.split('?');

      if (req.headers['content-type'] === 'application/json') {
        let bodyJson = '';
        req.on('data', chunk => (bodyJson += chunk));
        req.on('end', () => {
          try {
            const body = JSON.parse(bodyJson);
            resolve({
              method,
              path: path.replace(/^\//, ''),
              data: body
            });
          } catch (error) {
            reject(new Error('Incorrect data format'));
          }
        });
      } else {
        const data = queryString
          ? queryString.split('&').reduce((res, pare) => {
              const [key, value] = pare.split('=');
              res[key] = /^\d+$/.test(value) ? Number(value) : value;
              return res;
            }, {})
          : {};

        resolve({
          method,
          path: path.replace(/^\//, ''),
          data
        });
      }
    });
  }

  /**
   * @public
   */
  start() {
    createServer(this.$main).listen(this.$port);
  }
}

new Server().start();
