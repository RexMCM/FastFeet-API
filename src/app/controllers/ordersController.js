import * as Yup from 'yup';
import orders from '../models/order';
import Deliveryman from '../models/deliveryMan';
import Recipient from '../models/recipient';
// import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/orderMail';

class OrdersController {
  async store(req, res) {
    const schema = Yup.object(req.body).shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }
    const { deliveryman_id, recipient_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id, {
      attributes: ['name', 'email'],
    });
    const recipient = await Recipient.findByPk(recipient_id, {
      attributes: ['name', 'street', 'number', 'city', 'state'],
    });

    if (!(deliveryman || recipient)) {
      return res
        .status(400)
        .json({ error: 'Deliveryman and Recipient does not exists' });
    }

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const order = await orders.create({
      product,
      deliveryman_id,
      recipient_id,
    });

    await Queue.add(NewOrderMail.key, {
      deliveryman,
      recipient,
      order,
    });
    return res.json(order);
  }
}

export default new OrdersController();
