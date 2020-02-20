import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryMan from '../models/deliveryMan';
import Recipient from '../models/recipient';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import Order from '../models/order';

class DeliveryProblemsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      delivery_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const { description, delivery_id } = req.body;
    const checkDeliveryExist = await Order.findByPk(delivery_id);

    if (!checkDeliveryExist) {
      return res.status(400).json({ error: 'Delivery order does not exist' });
    }

    const response = await DeliveryProblem.create({
      description,
      delivery_id,
    });

    return res.json(response);
  }

  async index(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll();

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const { id } = req.params;

    const ordersWithProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
    });

    return res.json(ordersWithProblems);
  }

  async delete(req, res) {
    const { id } = req.params;

    const { delivery_id } = await DeliveryProblem.findByPk(id);
    const delivery = await Order.findByPk(delivery_id, {
      include: [
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'number', 'city', 'state'],
        },
      ],
    });
    const { canceled_at, end_date } = delivery;
    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not exists.' });
    }

    if (canceled_at) {
      return res
        .status(400)
        .json({ error: 'the order has already been canceled' });
    }
    if (end_date) {
      return res
        .status(400)
        .json({ error: 'the order has already been delivered.' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancellationMail.key, {
      deliveryman: delivery.deliveryman,
      recipient: delivery.recipient,
      product: delivery.product,
    });

    return res.json({ msg: 'Canceled' });
  }
}

export default new DeliveryProblemsController();
