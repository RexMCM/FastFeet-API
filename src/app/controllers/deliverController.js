import * as Yup from 'yup';
import deliveryMan from '../models/deliveryMan';
import Orders from '../models/orders';
import Recipient from '../models/recipient';

class DeliverController {
  async index(req, res) {
    const deliveryManExist = await deliveryMan.findByPk(req.params.id);

    if (!deliveryManExist) {
      return res.json(400).json({ error: 'Delivery man does not exist' });
    }

    const ordersById = await Orders.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
      attributes: ['id', 'product', 'recipient_id'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    return res.json(ordersById);
  }
}
export default new DeliverController();
