'use client';

import { AnimatePresence, m } from 'framer-motion';
import { FC, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FOXPOST_PACKAGE_MAX_LIMIT,
  FOXPOST_SHIPPING_FEE,
  LOCAL_PICKUP_ADDRESS,
} from '~/lib/constants';
import { parsePhoneNumber } from '~/lib/formatters';
import { getTotalPackageInfo, isFitInMaxLimit } from '~/lib/foxpost';
import { OrderForm } from '~/lib/validation-schemas';
import { useCartStore } from '~/store/use-cart-store';
import FormattedPhoneNumberInput from './formatted-phone-number-input';
import FoxpostMap from './foxpost-map';
import LazyLoadFramerMotion from './lazy-load-framer-motion';
import ShippingOptionRadioInput from './shipping-option-radio-input';

const CheckoutShippingForm: FC = () => {
  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<OrderForm>();
  const cart = useCartStore((state) => state.cart);

  const [isShowFoxpostMap, setIsShowFoxpostMap] = useState(false);

  const totalPackageSize = useMemo(() => getTotalPackageInfo(cart), [cart]);

  const isFitInFoxpostLimit = isFitInMaxLimit(totalPackageSize);

  const onPersonalPickupOptionClick = () => {
    setValue('shippingPostcode', LOCAL_PICKUP_ADDRESS.shippingPostcode);
    setValue('shippingCity', LOCAL_PICKUP_ADDRESS.shippingCity);
    setValue('shippingAddress', LOCAL_PICKUP_ADDRESS.shippingAddress);

    trigger(['shippingPostcode', 'shippingCity', 'shippingAddress']);
  };

  const onFoxpostOptionClick = () => {
    const { shippingOption } = getValues();

    if (shippingOption !== 'Foxpost automatába') {
      setValue('shippingPostcode', '');
      setValue('shippingCity', '');
      setValue('shippingAddress', '');
    }

    setIsShowFoxpostMap(true);
  };

  const onPostOptionClick = () => {
    const { shippingOption } = getValues();

    if (shippingOption !== 'Postai szállítás') {
      setValue('shippingPostcode', '');
      setValue('shippingCity', '');
      setValue('shippingAddress', '');
    }
  };

  return (
    <>
      <div>
        <div className="mx-auto max-w-screen-sm">
          <h2 className="underline underline-offset-8">Elérhetőség</h2>
          <div className="d-form-control">
            <label className="d-label">
              <span className="d-label-text text-lg">Email</span>
            </label>
            <input
              type="text"
              placeholder={'mail.papirsarkany@gmail.com'}
              className="d-input d-input-bordered"
              {...register('email')}
            />
            <label className="d-label">
              <span className="d-label-text-alt text-error">
                {errors.email?.message}
              </span>
            </label>
          </div>
          <div className="gap-4 sm:grid sm:grid-cols-2">
            <div className="d-form-control">
              <label className="d-label">
                <span className="d-label-text text-lg">Vezetéknév</span>
              </label>
              <input
                type="text"
                className="d-input d-input-bordered"
                {...register('lastName')}
              />
              <label className="d-label">
                <span className="d-label-text-alt text-error">
                  {errors.lastName?.message}
                </span>
              </label>
            </div>
            <div className="d-form-control">
              <label className="d-label">
                <span className="d-label-text text-lg">Keresztnév</span>
              </label>
              <input
                type="text"
                className="d-input d-input-bordered"
                {...register('firstName')}
              />
              <label className="d-label">
                <span className="d-label-text-alt text-error">
                  {errors.firstName?.message}
                </span>
              </label>
            </div>
          </div>
          <div className="d-form-control">
            <label className="d-label">
              <span className="d-label-text text-lg">Telefonszám</span>
            </label>
            <FormattedPhoneNumberInput
              {...register('phoneNumber', {
                setValueAs: (value: string) => parsePhoneNumber(value),
              })}
            />
            <label className="d-label">
              <span className="d-label-text-alt text-error">
                {errors.phoneNumber?.message}
              </span>
            </label>
          </div>
          <h2 className="underline underline-offset-8">Szállítás</h2>
          <ShippingOptionRadioInput
            label={'Személyes átvétel'}
            onClick={onPersonalPickupOptionClick}
            value="Személyes átvétel"
          />
          <ShippingOptionRadioInput
            label={
              <>
                <div className="text-foxpost-red">Foxpost automatába </div>
                {!isFitInFoxpostLimit && (
                  <div className="text-sm font-normal sm:text-lg">
                    {`maximum ${FOXPOST_PACKAGE_MAX_LIMIT.weight}kg és (${FOXPOST_PACKAGE_MAX_LIMIT.x}x${FOXPOST_PACKAGE_MAX_LIMIT.y}x${FOXPOST_PACKAGE_MAX_LIMIT.z}cm-ig)`}
                  </div>
                )}
              </>
            }
            shippingFee={FOXPOST_SHIPPING_FEE}
            onClick={onFoxpostOptionClick}
            value="Foxpost automatába"
            isDisabled={!isFitInFoxpostLimit}
          />
        </div>
        <LazyLoadFramerMotion>
          <AnimatePresence>
            {watch('shippingOption') === 'Foxpost automatába' &&
              isShowFoxpostMap && (
                <m.div
                  initial={{
                    scaleY: 0,
                    transformOrigin: 'top',
                  }}
                  animate={{
                    scaleY: 1,
                  }}
                  exit={{
                    scaleY: 0,
                    opacity: 0,
                    transitionTimingFunction: 'ease-in',
                  }}
                >
                  <FoxpostMap hideMap={() => setIsShowFoxpostMap(false)} />
                </m.div>
              )}
          </AnimatePresence>
        </LazyLoadFramerMotion>
        <div className="mx-auto max-w-screen-sm">
          <ShippingOptionRadioInput
            label="Postai szállítás"
            value="Postai szállítás"
            onClick={onPostOptionClick}
            shippingFee={'szállítási költség'}
          />
          <span className="text-error">{errors.shippingOption?.message}</span>
          {watch('shippingOption') === 'Postai szállítás' && (
            <>
              <div className="d-form-control">
                <label className="d-label">
                  <span className="d-label-text text-lg">Irányítószám</span>
                </label>
                <input
                  type="text"
                  className="d-input d-input-bordered"
                  {...register('shippingPostcode')}
                />
                <label className="d-label">
                  <span className="d-label-text-alt text-error">
                    {errors.shippingPostcode?.message}
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
                  {...register('shippingCity')}
                />
                <label className="d-label">
                  <span className="d-label-text-alt text-error">
                    {errors.shippingCity?.message}
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
                  {...register('shippingAddress')}
                />
                <label className="d-label">
                  <span className="d-label-text-alt text-error">
                    {errors.shippingAddress?.message}
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Emelet, ajtó, egyéb (opcionális)"
                  className="d-input d-input-bordered"
                  {...register('shippingSubaddress')}
                />
                <label className="d-label">
                  <span className="d-label-text-alt text-error">
                    {errors.shippingSubaddress?.message}
                  </span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-screen-sm">
        <div className="flex justify-end">
          <button
            type="submit"
            className="d-btn d-btn-primary d-btn-block uppercase sm:w-auto"
          >
            Tovább
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutShippingForm;
