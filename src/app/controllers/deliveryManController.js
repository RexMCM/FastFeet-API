import * as Yup from 'yup';
import deliveryMan from '../models/deliveryMan';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const deliveryManExist = await deliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (deliveryManExist) {
      return res.status(400).json({ error: 'Delivery man already exist' });
    }
    const { name, email } = await deliveryMan.create(req.body);
    return res.json({
      name,
      email,
    });
  }

  async show(req, res) {
    const allDeliveryMan = await deliveryMan.findAll();

    res.json(allDeliveryMan);
  }

  async delete(req, res) {
    const deliveryToBeDeleted = await deliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (!deliveryToBeDeleted) {
      return res.status(404).json({ error: 'Delivery man not found' });
    }

    await deliveryToBeDeleted.destroy();

    return res.json({ message: 'Deletion completed' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const delivery = await deliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery man not found' });
    }

    const { name, email } = await delivery.update(req.body);

    return res.json({ name, email });
  }
}

export default new DeliveryManController();
