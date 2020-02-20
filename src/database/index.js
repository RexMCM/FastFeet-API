import Sequelize from 'sequelize';
import User from '../app/models/user';
import Recipient from '../app/models/recipient';
import File from '../app/models/file';
import Order from '../app/models/order';
import DeliveryProblem from '../app/models/DeliveryProblem';
import deliveryMan from '../app/models/deliveryMan';
import databaseConfig from '../config/database';

const models = [User, Recipient, File, deliveryMan, Order, DeliveryProblem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
