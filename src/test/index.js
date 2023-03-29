import Server, { getInterface } from '../index';

class DataProvider extends getInterface() {}

new Server(new DataProvider()).start();
