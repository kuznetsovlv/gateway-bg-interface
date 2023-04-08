import {
  APP_TYPE,
  RESPONSE_HEADERS,
  ERROR_CODES,
  EMPTY_RESPONSE_HEADERS,
  BASE
} from './consttants';

/**
 * @typedef {'GET'|'POST'|'PUT'|'DELETE'} Method
 */

/**
 * @typedef {Object} ParsedRequest
 * @property {string} path
 * @property {Method} method
 * @property {Object|*[]} body
 * @property {Object} query
 */

/**
 * @typedef {Object} Query
 * @property {string} [serial]
 * @property {number} [uid]
 */

export default class Processor {
  /**
   * @param request
   * @param response
   * @param {DataProducerInterface} dataProducer
   */
  constructor(request, response, dataProducer) {
    this.$request = request;
    this.$response = response;
    this.$dataProducer = dataProducer;

    this.process = this.process.bind(this);
  }

  /**
   * @private
   */
  $sendNotFound() {
    this.$sendData(404, 'Not found');
  }

  /**
   * @private
   */
  $sendForbidden() {
    this.$sendData(403, 'Forbidden');
  }

  /**
   * @private
   * @param {Error} error
   * @param {string} errorCode
   * @param {number} [responseCode = 400]
   */
  $sendError({ error, errorCode = ERROR_CODES.unknown, responseCode = 400 }) {
    this.$sendData(responseCode, {
      code: errorCode,
      message: error.message
    });
  }

  /**
   * @private
   * @param {number} code
   * @param {Object|*[]|string} [data]
   */
  $sendData(code, data) {
    if (!data) {
      this.$response.writeHead(code, {});
      this.$response.end();
    } else {
      const isPlain = typeof data === 'string';
      const headers = isPlain ? EMPTY_RESPONSE_HEADERS : RESPONSE_HEADERS;
      const text = isPlain ? data : JSON.stringify(data);

      this.$response.writeHead(code, headers);
      this.$response.end(text);
    }
  }

  /**
   * @private
   * @return Promise<ParsedRequest>
   */
  async $parseRequest() {
    return new Promise((resolve, reject) => {
      /**
       * @type {Method}
       */
      const method = this.$request.method;
      const url = this.$request.url;

      if (!new RegExp(`^${BASE}.+`).test(url)) {
        reject(new Error('Incorrect url'));
        return;
      }

      const [clearUrl = '', queryString] = url.split('?');

      const path = clearUrl.replace(new RegExp(`^${BASE}`), '');

      const query = queryString
        ? queryString.split('&').reduce((res, pare) => {
            const [key, value] = pare.split('=');
            res[key] = /^\d+$/.test(value) ? Number(value) : value;
            return res;
          }, {})
        : {};

      if (this.$request.headers['content-type'] === APP_TYPE) {
        let bodyJson = '';
        this.$request.on('data', chunk => (bodyJson += chunk));
        this.$request.on('end', () => {
          try {
            const body = JSON.parse(bodyJson);
            resolve({
              method,
              path: path.replace(/^\//, ''),
              query,
              body
            });
          } catch (error) {
            reject(new Error('Incorrect data format'));
          }
        });
      } else {
        resolve({
          method,
          path: path.replace(/^\//, ''),
          query,
          body: {}
        });
      }
    });
  }

  /**
   * @private
   * @param {Object|null} data
   */
  $sendFoundResult(data) {
    if (data) {
      this.$sendData(200, data);
    } else {
      this.$sendNotFound();
    }
  }

  /**
   * @private
   * @param {string} path
   * @param {Query} query
   */
  $get(path, { serial, uid }) {
    switch (path) {
      case 'gateways':
        this.$sendFoundResult(this.$dataProducer.getGateways());
        break;
      case 'gateway':
        if (typeof serial === 'string') {
          this.$sendFoundResult(this.$dataProducer.getGateway(serial));
        } else {
          this.$sendError({
            error: new Error("Gateway's serial number is not set"),
            errorCode: ERROR_CODES.wrongData
          });
        }
        break;
      case 'devices':
        this.$sendFoundResult(this.$dataProducer.getDevices(serial));
        break;
      case 'device':
        if (typeof uid === 'number') {
          this.$sendFoundResult(this.$dataProducer.getDevice(uid));
        } else {
          this.$sendError({
            error: new Error("Device's uid is not set"),
            errorCode: ERROR_CODES.wrongData
          });
        }
        break;
      default:
        this.$sendNotFound();
        break;
    }
  }

  /**
   * @private
   * @param {string} path
   * @param {Object} body
   */
  $put(path, body) {
    let existing = false;
    switch (path) {
      case 'gateway':
        const { serial } = body;
        if (typeof serial === 'string') {
          existing = !!this.$dataProducer.getGateway(serial);
        }
        this.$sendData(
          existing ? 200 : 201,
          this.$dataProducer.putGateway(body)
        );
        break;
      case 'device':
        const { uid } = body;
        if (typeof uid === 'number') {
          existing = !!this.$dataProducer.getDevice(uid);
        }
        this.$sendData(
          existing ? 200 : 201,
          this.$dataProducer.putDevice(body)
        );
        break;
      default:
        this.$sendNotFound();
        break;
    }
  }

  /**
   * @private
   * @param {string} path
   * @param {Query} query
   */
  $delete(path, { serial, uid }) {
    switch (path) {
      case 'gateway':
        if (typeof serial === 'string') {
          this.$sendData(200, this.$dataProducer.deleteGateway(serial));
        } else {
          this.$sendError({
            error: new Error("Gateway's serial number is not set"),
            errorCode: ERROR_CODES.wrongData
          });
        }
        break;
      case 'device':
        if (typeof uid === 'number') {
          this.$sendData(200, this.$dataProducer.deleteDevice(uid));
        } else {
          this.$sendError({
            error: new Error("Device's uid is not set"),
            errorCode: ERROR_CODES.wrongData
          });
        }
        break;
      default:
        this.$sendNotFound();
        break;
    }
  }

  /**
   * @private
   * @param {string} path
   * @param {string} serial
   * @param {number[]} devices
   */
  $post(path, { serial, devices }) {
    if (
      typeof serial !== 'string' ||
      !Array.isArray(devices) ||
      !devices.length ||
      devices.some(uid => typeof uid !== 'number')
    ) {
      this.$sendError({
        error: new Error('Incorrect data'),
        errorCode: ERROR_CODES.wrongData
      });
    } else {
      switch (path) {
        case 'bind':
          this.$sendData(200, this.$dataProducer.bind(serial, devices));
          break;
        case 'unbind':
          this.$dataProducer.unbind(serial, devices);
          this.$sendData(200);
          break;
        default:
          this.$sendNotFound();
          break;
      }
    }
  }

  /**
   * @public
   */
  process() {
    this.$parseRequest().then(
      ({ path, body, query, method }) => {
        try {
          switch (method) {
            case 'GET':
              this.$get(path, query);
              break;
            case 'PUT':
              this.$put(path, body);
              break;
            case 'DELETE':
              this.$delete(path, query);
              break;
            case 'POST':
              this.$post(path, body);
              break;
            default:
              this.$sendError({
                error: new Error('Unknown method'),
                errorCode: ERROR_CODES.wrongRequest
              });
              break;
          }
        } catch (error) {
          this.$sendError({
            error: error instanceof Error ? error : new Error(error),
            errorCode: ERROR_CODES.unknown
          });
        }
      },
      error => this.$sendError({ error, errorCode: ERROR_CODES.wrongRequest })
    );
  }
}
