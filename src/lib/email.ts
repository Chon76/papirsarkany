import { Order } from '@prisma/client';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { CUSTOMER_TEMPLATE_ID, VENDOR_TEMPLATE_ID } from './constants';
import { env } from './env';
import { OrderMail } from './types';

export function setSendgridApiKey() {
  const { SENDGRID_API_KEY } = env;
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendEmail(mailData: MailDataRequired) {
  await sgMail.send(mailData);

  console.log(`Email is sent to ${mailData.to}`);
}

export async function sendOrderEmails(order: Order, orderEmailData: OrderMail) {
  const { VENDOR_EMAIL_ADDRESS } = env;

  const vendorMail: MailDataRequired = {
    from: 'mail.papirsarkany@gmail.com',
    to: VENDOR_EMAIL_ADDRESS,
    templateId: VENDOR_TEMPLATE_ID,
    dynamicTemplateData: {
      ...orderEmailData,
      subject: `Rendelés #${order.id}`,
    } satisfies OrderMail,
  };

  const customerMail: MailDataRequired = {
    from: 'mail.papirsarkany@gmail.com',
    to: orderEmailData.contact.email,
    replyTo: VENDOR_EMAIL_ADDRESS,
    templateId: CUSTOMER_TEMPLATE_ID,
    dynamicTemplateData: orderEmailData,
  };

  await sendEmail(vendorMail);
  await sendEmail(customerMail);
}
