/*eslint-disable no-unused-vars*/
import DataProducerInterface from '../DataProducerInterface';

export default class DataProducer extends DataProducerInterface {
  getGateways() {
    return [
      {
        serial: 'string',
        name: 'string'
      }
    ];
  }

  getGateway(serial) {
    return {
      serial: 'string',
      name: 'string',
      ip: 0,
      devices: [0]
    };
  }

  putGateway(gateway) {
    return {
      serial: 'string'
    };
  }

  // eslint-disable-next-line no-empty-function
  deleteGateway(serial) {}

  getDevices(serial) {
    return [
      {
        uid: 0,
        vendor: 'string'
      }
    ];
  }

  getDevice(uid) {
    return {
      uid: 0,
      vendor: 'string',
      date_created: 0,
      status: 'online'
    };
  }

  putDevice(gateway) {
    return {
      uid: 0
    };
  }

  // eslint-disable-next-line no-empty-function
  deleteDevice(uid) {}

  bind(serial, devices) {
    return {
      bound: [0]
    };
  }

  // eslint-disable-next-line no-empty-function
  unbind(serial, devices) {}
}
