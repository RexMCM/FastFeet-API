import * as Yup from 'yup';
import orders from '../models/orders';
import Deliveryman from '../models/deliveryMan';
import Recipient from '../models/recipient';
import Notification from '../schemas/Notification';

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

    const checkDeliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    const checkRecipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!(checkDeliverymanExists || checkRecipientExists)) {
      return res
        .status(400)
        .json({ error: 'Deliveryman and Recipient does not exists' });
    }

    if (!checkRecipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    if (!checkDeliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const { name, email } = checkDeliverymanExists;

    const order = await orders.create({
      product,
      deliveryman_id,
      recipient_id,
    });

    await Notification.create({
      content: `Nova encomenda! Produto: ${product} pronto para retirada`,
      user: deliveryman_id,
    });

    return res.json(order);
  }
}

export default new OrdersController();
