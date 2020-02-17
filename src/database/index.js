import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/user';
import Recipient from '../app/models/recipient';
import File from '../app/models/file';
import Orders from '../app/models/orders';
import deliveryMan from '../app/models/deliveryMan';
import databaseConfig from '../config/database';

const models = [User, Recipient, File, deliveryMan, Orders];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/fastfeet',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
