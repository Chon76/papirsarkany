import { createOrder } from "@/lib/db";
import { CartItem, FormSchemaObject, OrderMail } from "@/lib/types";
import sgMail, { MailDataRequired, ResponseError } from "@sendgrid/mail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      data: FormSchemaObject;
      cart: CartItem[];
      orderEmailData: OrderMail;
    };
    const order = await createOrder(body.data, body.cart);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "no_key");

    const vendorTemplateId = "d-6eee94a3becb45d2b50e5f8d6a1ac491";
    const customerTemplateId = "d-c5e1d19e77f54103978a24ff6c90344f";

    const { VENDOR_EMAIL_ADDRESS } = process.env;

    if (!VENDOR_EMAIL_ADDRESS) {
      throw Error("No vendor email provided.");
    }

    const vendorMail: MailDataRequired = {
      from: VENDOR_EMAIL_ADDRESS,
      to: VENDOR_EMAIL_ADDRESS,
      templateId: vendorTemplateId,
      dynamicTemplateData: {
        ...body.orderEmailData,
        subject: `Rendelés #${order.id}`,
      } as OrderMail,
    };

    const customerMail: MailDataRequired = {
      from: VENDOR_EMAIL_ADDRESS,
      to: body.orderEmailData.contact.email,
      templateId: customerTemplateId,
      dynamicTemplateData: body.orderEmailData,
    };

    await sgMail
      .send(vendorMail)
      .then(() => {
        console.log(`Vendor email is sent to ${VENDOR_EMAIL_ADDRESS}`);
      })
      .catch((error: ResponseError) => {
        console.error(error);
      });

    await sgMail
      .send(customerMail)
      .then(() => {
        console.log(
          `Customer email is sent to ${body.orderEmailData.contact.email}`,
        );
      })
      .catch((error: ResponseError) => {
        console.error(error);
      });

    return NextResponse.json(body);
  } catch (error) {
    console.error(error);
    NextResponse.json(
      { error: `Internal Server Error reason: ${error}}` },
      { status: 500 },
    );
    return;
  }
}
