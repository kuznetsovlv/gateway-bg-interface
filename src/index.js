import { createServer } from 'node:http';

import DataProducerInterface from './DataProducerInterface';
import Processor from './Processor';

export default class Server {
  /**
   * @param {DataProducerInterface} dataProducer
   * @param {number} [port = 8000]
   */
  constructor(dataProducer = new DataProducerInterface(), port = 8000) {
    this.$dataProducer = dataProducer;
    this.$port = port;

    this.$main = this.$main.bind(this);
    this.start = this.start.bind(this);
  }

  /**
   * @private
   * @param  req
   * @param  res
   */
  $main(req, res) {
    new Processor(req, res, this.$dataProducer).process();
  }
  /**
   * @public
   */
  start() {
    createServer(this.$main).listen(this.$port);
  }
}

const getInterface = () => DataProducerInterface;

export { getInterface };
