/*eslint-disable no-unused-vars*/

/**
 * @typedef {Object} SimpleGateway
 * @property {string} serial
 * @property {string} name
 */

/**
 * @typedef {Object} Gateway
 * @property {string} serial
 * @property {string} name
 * @property {number} ip
 * @property {number[]} devices
 */

/**
 * @typedef {Object} OptionalGateway
 * @property {string} [serial]
 * @property {string} [name]
 * @property {number} [ip]
 * @property {number[]} [devices]
 */

/**
 * @typedef {Object} SimpleDevice
 * @property {number} uid
 * @property {string} vendor
 */

/**
 * @typedef {'online'|'offline'} Status
 */

/**
 * @typedef {Object} Device
 * @property {number} uid
 * @property {string} vendor
 * @property {number} date_created
 * @property {Status} status
 */

/**
 * @typedef {Object} OptionalDevice
 * @property {string} [uid]
 * @property {string} [vendor]
 * @property {number} [dateCreated]
 * @property {Status} [status]
 */

export default class DataProducerInterface {
  /**
   * @public
   * Returns list of available gateways
   * @return {SimpleGateway[]}
   */
  getGateways() {
    throw new Error('Unimplemented method getGateways');
  }

  /**
   * @public
   * Returns information about gateway
   * @param {string} serial - gateway's unique serial number
   * @return {Gateway|null}
   */
  getGateway(serial) {
    throw new Error('Unimplemented method getGateway');
  }

  /**
   * @public
   * Modifies or creates new gateway
   * @param {OptionalGateway} gateway
   * @return {{serial: string}}
   */
  putGateway(gateway) {
    throw new Error('Unimplemented method putGateway');
  }

  /**
   * @public
   * Deletes gateway
   * @param {string} serial - gateway's unique serial number
   */
  deleteGateway(serial) {
    throw new Error('Unimplemented method deleteGateway');
  }

  /**
   * @public
   * Returns list of available devices
   * @param {string} [serial] - unique gateway's serial number, should return all devices
   * @return {SimpleDevice[]|null}
   */
  getDevices(serial) {
    throw new Error('Unimplemented method getDevices');
  }

  /**
   * @public
   * Returns information about devices
   * @param {number} uid - device's uid
   * @return {Device|null}
   */
  getDevice(uid) {
    throw new Error('Unimplemented method getDevice');
  }

  /**
   * @public
   * Modifies or creates new device
   * @param {OptionalDevice} gateway
   * @return {{uid: number}}
   */
  putDevice(gateway) {
    throw new Error('Unimplemented method putDevice');
  }

  /**
   * @public
   * Deletes device
   * @param {number} uid - gateway's unique serial number
   */
  deleteDevice(uid) {
    throw new Error('Unimplemented method deleteDevice');
  }

  /**
   * @public
   * Binds devices to gateway
   * @param {string} serial - gateway's unique serial number
   * @param {number[]} devices - list of devices' uids
   * @return {{bound: number[]}} - list of successfully bound devices' uids
   */
  bind(serial, devices) {
    throw new Error('Unimplemented method bind');
  }

  /**
   * @public
   * Unbinds devices to gateway
   * @param {string} serial - gateway's unique serial number
   * @param {number[]} devices - list of devices' uids
   */
  unbind(serial, devices) {
    throw new Error('Unimplemented method unbind');
  }
}
