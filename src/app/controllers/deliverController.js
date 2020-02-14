import * as Yup from 'yup';

import { startOfDay, endOfDay } from 'date-fns';
import Sequelize, { Op } from 'sequelize';
import deliveryMan from '../models/deliveryMan';
import Orders from '../models/orders';
import Recipient from '../models/recipient';

class DeliverController {
  async index(req, res) {
    const deliveryManExist = await deliveryMan.findByPk(req.params.id);

    if (!deliveryManExist) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
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

  async update(req, res) {
    const deliveryManExist = await deliveryMan.findByPk(req.params.id);

    if (!deliveryManExist) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }
    const date = new Date();
    console.log(date);
    const startToday = startOfDay(date);
    console.log(startToday);
    const endToday = endOfDay(date);
    console.log(endToday);

    const countDeliveries = await Orders.count({
      where: {
        deliveryman_id: req.params.id,
        start_date: {
          [Op.lt]: endToday,
          [Op.gt]: startToday,
        },
      },
    });
    console.log(countDeliveries);
    if (countDeliveries > 5) {
      return res
        .status(400)
        .json({ error: 'You can only make 5 deliveries per day' });
    }

    const { order_id } = req.body;
    const order = await Orders.findByPk(order_id);
    if (!order) {
      res.status(400).json({ error: 'Order does not exist' });
    }
    const response = await order.update({
      start_date: new Date(),
    });

    return res.json(response);
  }
}
export default new DeliverController();
