'use client';

import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import Link from 'next/link';
import { FC } from 'react';
import { OrderForm } from '~/lib/validation-schemas';
import { useCheckoutFormStore } from '~/store/use-checkout-form-store';
import Card from './card';
import OrderSummaryCard from './order-summary-card';

const CheckoutSummaryForm: FC = () => {
  const router = useRouter();
  const {
    register,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<OrderForm>();
  const formValues = getValues();

  const prevStep = useCheckoutFormStore((state) => state.prevStep);

  return (
    <div className="space-y-6">
      <h1 className="text-center font-bold">Rendelés összegzése</h1>

      <OrderSummaryCard layout="definitive" />

      <div className="max-w grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="mx-auto w-full max-w-xs p-6">
          <div>
            <h4 className="font-bold underline">Elérhetőség</h4>
            <div>
              {formValues.lastName} {formValues.firstName}
            </div>
            <div>{formValues.email}</div>
            <div>{formValues.phoneNumber}</div>
          </div>
        </Card>

        <Card className="mx-auto w-full max-w-xs p-6">
          <div>
            <h4 className="font-bold underline">Szállítás</h4>
            <div>{formValues.shippingOption}</div>
            <div>
              {formValues.shippingPostcode} {formValues.shippingCity}
            </div>
            <div>{formValues.shippingAddress}</div>
            <div>{formValues.shippingSubaddress}</div>
          </div>
        </Card>

        <Card className="mx-auto w-full max-w-xs p-6">
          <div>
            <h4 className="font-bold underline">Fizetés</h4>
            <div>{formValues.paymentOption}</div>
            <div>
              {formValues.billingPostcode} {formValues.billingCity}
            </div>
            <div>{formValues.billingAddress}</div>
            <div>{formValues.billingSubaddress}</div>
          </div>
        </Card>
      </div>

      <label className="d-form-control">
        <div className="d-label">
          <span className="d-labels-text text-lg">Megjegyzés</span>
        </div>
        <textarea
          className="d-textarea d-textarea-bordered d-textarea-primary h-24"
          {...register('comment')}
        ></textarea>
        <div className="d-label justify-end">
          <span className="d-label-text-alt">
            14 napos elállási jog fentartva a rendelés leadásától számítva.
          </span>
        </div>
      </label>

      <div className="text-center text-xs">
        A „Megrendelem” gomb megnyomásával Ön elfogadja az{' '}
        <Link href="/aszf" className="d-link">
          Adatvédelmi Nyilatkozat és Felhasználási Feltételek
        </Link>{' '}
        tartalmát.
      </div>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
        <button
          type="button"
          className="d-btn d-btn-outline d-btn-neutral d-btn-block uppercase sm:w-auto"
          onClick={prevStep}
        >
          Vissza
        </button>
        <button
          type="submit"
          className={`d-btn d-btn-success d-btn-block uppercase sm:w-auto`}
          disabled={isSubmitting}
          onMouseEnter={() => router.prefetch('/sikeres-rendeles')}
        >
          {isSubmitting && (
            <span className="d-loading d-loading-spinner"></span>
          )}
          Megrendelem
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummaryForm;
