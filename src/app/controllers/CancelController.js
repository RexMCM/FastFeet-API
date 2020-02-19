import Orders from '../models/orders';

class CancelController {
  async update(req, res) {
    const { order_id } = req.body;

    const order = await Orders.findByPk(order_id);
    if (!order) {
      res.status(400).json({ error: 'Order does not exist' });
    }

    const { canceled_at } = order;
    if (canceled_at !== null) {
      res.status(400).json({
        error: "You can't work with a order that was already canceled",
      });
    }
    const response = await order.update({
      canceled_at: new Date(),
    });

    return res.json(response);
  }
}

export default new CancelController();
