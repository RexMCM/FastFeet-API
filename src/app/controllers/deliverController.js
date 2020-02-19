import moment from 'moment';
import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
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
    const format = 'hh:mm:ss';
    const today = moment();
    const beforeTime = moment('08:00:00', format);
    const afterTime = moment('18:00:00', format);

    if (!today.isBetween(beforeTime, afterTime)) {
      console.log('entrei');
      return res.status(400).json({
        error: "You can't do this action now, try again between 08:00-16:00",
      });
    }
    const startToday = startOfDay(new Date());
    const endToday = endOfDay(new Date());
    const countDeliveries = await Orders.count({
      where: {
        deliveryman_id: req.params.id,
        start_date: {
          [Op.lt]: endToday,
          [Op.gt]: startToday,
        },
      },
    });
    if (countDeliveries > 4) {
      return res
        .status(400)
        .json({ error: 'You can only make 5 deliveries per day' });
    }

    const { order_id } = req.body;
    const order = await Orders.findByPk(order_id);
    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }
    const { canceled_at } = order;
    if (canceled_at !== null) {
      return res.status(400).json({
        error: "You can't work with a order that was already canceled",
      });
    }
    const response = await order.update({
      start_date: new Date(),
    });

    return res.json(response);
  }
}
export default new DeliverController();
