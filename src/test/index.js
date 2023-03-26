import Server from '../index';
import DataProducer from './DataProducer';

new Server(new DataProducer()).start();
