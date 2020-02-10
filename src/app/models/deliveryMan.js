import Sequelize, { Model } from 'sequelize';

class DeliveryMan extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }
}

export default DeliveryMan;
