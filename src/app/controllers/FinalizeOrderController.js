import * as Yup from 'yup';
import Orders from '../models/orders';

class FinalizeController {
  async update(req, res) {
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const { order_id, signature_id } = req.body;

    const order = await Orders.findByPk(order_id);
    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    const { canceled_at, start_date } = order;
    if (start_date == null) {
      return res.status(400).json({
        error: 'This order was not started yet, so you can not canceled it.',
      });
    }
    if (canceled_at !== null) {
      return res.status(400).json({
        error: "You can't work with a order that was already canceled",
      });
    }

    const response = await order.update({
      signature_id,
      end_date: new Date(),
    });

    return res.json(response);
  }
}

export default new FinalizeController();
