import * as Yup from 'yup';
import Recipient from '../models/recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_name: Yup.string().required(),
      number: Yup.integer().required(),
      complement: Yup.integer().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.integer().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const {
      id,
      recipient_name,
      number,
      complement,
      state,
      city,
      zip_code,
    } = Recipient.create(req.body);

    return res.json({
      id,
      recipient_name,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_name: Yup.string().required(),
      number: Yup.integer().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.integer().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const recipient = await Recipient.findByPk(req.params.id);

    await recipient.update(req.body);

    const {
      id,
      recipient_name,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.findByPk(req.params.id);

    return res.json({
      id,
      recipient_name,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
