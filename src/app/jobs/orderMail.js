import Mail from '../../lib/Mail';

class OrderMail {
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { name, email, product } = data;
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: `New Order received - ${product}`,
      text: "You have a new order and it's ready for delivery",
    });
  }
}

export default new OrderMail();
