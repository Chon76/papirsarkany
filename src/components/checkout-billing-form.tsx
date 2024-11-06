'use client';

import { ChangeEvent, FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { BillingOptionValue, ShippingOptionValue } from '~/lib/types';
import { OrderForm } from '~/lib/validation-schemas';
import { useCheckoutFormStore } from '~/store/use-checkout-form-store';
import BillingOptionRadioInput from './billing-option-radio-input';

const CheckoutBillingForm: FC = () => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useFormContext<OrderForm>();

  const prevStep = useCheckoutFormStore((state) => state.prevStep);

  const shippingBillingMap: Record<
    ShippingOptionValue,
    { billingOptionValue: BillingOptionValue; billingFee?: number | null }[]
  > = {
    'Személyes átvétel': [
      { billingOptionValue: 'Előreutalással', billingFee: undefined },
      { billingOptionValue: 'Átvételkor készpénzel', billingFee: undefined },
    ],
    'Foxpost automatába': [
      { billingOptionValue: 'Előreutalással', billingFee: undefined },
      {
        billingOptionValue: 'Átvételkor bankártyával',
        billingFee: undefined,
      },
    ],
    'Postai szállítás': [
      {
        billingOptionValue: 'Előreutalással',
        billingFee: undefined,
      },
      {
        billingOptionValue: 'Átvételkor készpénzel',
        billingFee: undefined,
      },
    ],
  };

  const selectedShippingOption = getValues('shippingOption');

  if (!selectedShippingOption) {
    throw new Error('Érvénytelen szállitási mód');
  }

  const onIsSameAdressAsShippingChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      syncShippingAndBilling();
      setValue('isSameAdressAsShipping', true);
    } else {
      setValue('billingPostcode', '');
      setValue('billingCity', '');
      setValue('billingAddress', '');
      setValue('billingSubaddress', '');
      setValue('isSameAdressAsShipping', false);
    }

    trigger(['isSameAdressAsShipping']);
  };

  const syncShippingAndBilling = () => {
    if (
      selectedShippingOption === 'Postai szállítás' &&
      getValues('isSameAdressAsShipping')
    ) {
      setValue('billingPostcode', getValues('shippingPostcode') || '');
      setValue('billingCity', getValues('shippingCity') || '');
      setValue('billingAddress', getValues('shippingAddress') || '');
      setValue('billingSubaddress', getValues('shippingSubaddress'));
    }
  };
  return (
    <div className="mx-auto max-w-screen-sm">
      <h2 className="underline underline-offset-8">Fizetés</h2>

      {shippingBillingMap[selectedShippingOption].map(
        ({ billingOptionValue, billingFee }) => (
          <BillingOptionRadioInput
            key={billingOptionValue}
            value={billingOptionValue}
            billingFee={billingFee}
            isDisabled={billingFee === null}
          />
        ),
      )}

      <span className="text-error">{errors.paymentOption?.message}</span>

      <h2 className="underline underline-offset-8">Számlázási cím</h2>

      {selectedShippingOption === 'Postai szállítás' && (
        <div className="d-form-control pt-4">
          <label className="d-label cursor-pointer justify-start gap-x-2">
            <input
              {...register('isSameAdressAsShipping')}
              onChange={(e) => onIsSameAdressAsShippingChange(e)}
              type="checkbox"
              className="d-checkbox checked:d-checkbox-primary"
            />
            <span className="d-label-text">
              A számlázási adataim megegyeznek a szállítási címemmel
            </span>
          </label>
        </div>
      )}

      {(selectedShippingOption !== 'Postai szállítás' ||
        !getValues('isSameAdressAsShipping')) && (
        <>
          <div className="d-form-control">
            <label className="d-label">
              <span className="d-label-text text-lg">Irányítószám</span>
            </label>
            <input
              type="text"
              className="d-input d-input-bordered"
              {...register('billingPostcode')}
            />
            <label className="d-label">
              <span className="d-label-text-alt text-error">
                {errors.billingPostcode?.message}
              </span>
            </label>
          </div>
          <div className="d-form-control">
            <label className="d-label">
              <span className="d-label-text text-lg">Város</span>
            </label>
            <input
              type="text"
              className="d-input d-input-bordered"
              {...register('billingCity')}
            />
            <label className="d-label">
              <span className="d-label-text-alt text-error">
                {errors.billingCity?.message}
              </span>
            </label>
          </div>
          <div className="d-form-control">
            <label className="d-label">
              <span className="d-label-text text-lg">Cím</span>
            </label>
            <input
              type="text"
              placeholder="Utca, házszám"
              className="d-input d-input-bordered"
              {...register('billingAddress')}
            />
            <label className="d-label">
              <span className="d-label-text-alt text-error">
                {errors.billingAddress?.message}
              </span>
            </label>
            <input
              type="text"
              placeholder="Emelet, ajtó, egyéb (opcionális)"
              className="d-input d-input-bordered"
              {...register('billingSubaddress')}
            />
            <label className="d-label">
              <span className="d-label-text-alt text-error">
                {errors.billingSubaddress?.message}
              </span>
            </label>
          </div>
        </>
      )}

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
          className="d-btn d-btn-primary d-btn-block uppercase sm:w-auto"
          onClick={() => syncShippingAndBilling()}
        >
          Tovább
        </button>
      </div>
    </div>
  );
};

export default CheckoutBillingForm;
