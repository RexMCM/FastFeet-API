import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
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
      created_at: new Date(),
    });

    return res.json(response);
  }
}

export default new DeliveryProblemsController();
