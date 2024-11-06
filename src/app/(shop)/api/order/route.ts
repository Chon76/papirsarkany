import { NextResponse } from 'next/server';

import { createOrder } from '~/lib/db';
import { sendEmail, sendOrderEmails, setSendgridApiKey } from '~/lib/email';
import { currencyFormatter } from '~/lib/formatters';
import {
  createParcel,
  getFoxpostPackageSize,
  getTotalPackageInfo,
} from '~/lib/foxpost';
import { isProdEnv, isStageEnv, normalizeOrderForm } from '~/lib/helpers';
import { OrderMail, OrderRequestBody } from '~/lib/types';

setSendgridApiKey();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody;
    const { cart, formData, totalPrice, foxpostOperatorId } = body;

    const normalizedFormData = normalizeOrderForm(formData);

    const order = await createOrder(normalizedFormData, cart);

    if (
      normalizedFormData.shippingOption === 'Foxpost automatába' &&
      foxpostOperatorId &&
      isProdEnv()
    ) {
      const cod =
        normalizedFormData.paymentOption === 'Átvételkor bankártyával'
          ? totalPrice
          : 0;

      const fullName = `${normalizedFormData.lastName} ${normalizedFormData.firstName}`;

      const foxpostResponse = await createParcel({
        cod,
        destination: foxpostOperatorId,
        recipientEmail: normalizedFormData.email,
        recipientName: fullName,
        recipientPhone: normalizedFormData.phoneNumber,
        size: getFoxpostPackageSize(getTotalPackageInfo(cart)) || 'M',
      });

      const foxpostResponseBody = (await foxpostResponse.json()) as {
        valid: boolean;
        parsels: unknown[];
      };

      if (!foxpostResponse.ok || !foxpostResponseBody.valid) {
        throw new Error(foxpostResponse.statusText);
      }
    }

    if (isProdEnv() || isStageEnv()) {
      const orderEmailData: OrderMail = {
        contact: {
          email: normalizedFormData.email,
          firstName: normalizedFormData.firstName,
          lastName: normalizedFormData.lastName,
          phone: normalizedFormData.phoneNumber,
        },
        shippingOption: normalizedFormData.shippingOption,
        shipping: {
          postcode: normalizedFormData.shippingPostcode,
          city: normalizedFormData.shippingCity,
          address: normalizedFormData.shippingAddress,
          subaddress: normalizedFormData.shippingSubaddress,
        },
        paymentOption: normalizedFormData.paymentOption,
        billing: {
          postcode: normalizedFormData.billingPostcode,
          city: normalizedFormData.billingCity,
          address: normalizedFormData.billingAddress,
          subaddress: normalizedFormData.billingSubaddress,
        },
        comment: normalizedFormData.comment,
        subject: 'papirsarkany.hu - Köszönöm rendelését!',
        products: cart.map((product) => ({
          name: product.name,
          price: currencyFormatter(product.price),
          quantity: product.quantity.toString(),
        })),
        total: currencyFormatter(totalPrice),
      };

      await sendOrderEmails(order, orderEmailData);
    }

    return NextResponse.json(body);
  } catch (error) {
    console.error(error);

    if (isProdEnv()) {
      await sendEmail({
        from: 'mail@papirsarkany.hu',
        to: 'balint.ducsai@gmail.com',
        subject: 'error detected in papirsarkany.hu/api/order',
        text: `Error caught in url papirsarkany/api/order. \nreason: ${error}`,
      });
    }

    return NextResponse.json(
      { error: `Internal Server Error reason: ${error}}` },
      { status: 500 },
    );
  }
}
