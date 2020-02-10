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

    const { name, email } = await deliveryMan.create(req.body);
    return res.json({
      name,
      email,
    });
  }
}

export default new DeliveryManController();
