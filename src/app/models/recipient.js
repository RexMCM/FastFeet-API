import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_name: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zip_code: Sequelize.INTEGER,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Recipient;
