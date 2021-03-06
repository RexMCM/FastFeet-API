import Mail from '../../lib/Mail';

class OrderMail {
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, order } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New Order for you!',
      template: 'newOrder',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        address: `${recipient.street}, N° ${recipient.number}, ${recipient.city} - ${recipient.state}`,
        product: order.product,
      },
    });
  }
}

export default new OrderMail();
