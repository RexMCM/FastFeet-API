import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'delivery_problems',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.order, { foreignKey: 'delivery_id' });
  }
}

export default DeliveryProblem;
