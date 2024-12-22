'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { redirect, useRouter } from 'next/navigation';
import { Children, FC, ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useOrder } from '~/hooks/use-order';
import { OrderForm, orderFormSchema } from '~/lib/validation-schemas';
import { useCartStore } from '~/store/use-cart-store';
import { useCheckoutFormStore } from '~/store/use-checkout-form-store';
import StepProgress from './step-progress';

type CheckoutStepperProps = {
  children: ReactNode;
};

const CheckoutFormStepper: FC<CheckoutStepperProps> = ({ children }) => {
  const router = useRouter();

  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const cart = useCartStore((state) => state.cart);
  const resetCart = useCartStore((state) => state.resetCart);

  const step = useCheckoutFormStore((state) => state.step);
  const nextStep = useCheckoutFormStore((state) => state.nextStep);
  const formValues = useCheckoutFormStore((state) => state.formValues);
  const setFormValues = useCheckoutFormStore((state) => state.setFormValues);
  const resetForm = useCheckoutFormStore((state) => state.resetForm);

  const { sendOrder } = useOrder();

  const isLast = step === Children.count(children) - 1;

  const formMethods = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema[step]),
    defaultValues: {
      ...formValues,
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = formMethods;

  const onSubmit = async (data: OrderForm) => {
    if (isSubmitting) {
      return;
    }

    setFormValues(data);

    if (!isLast) {
      nextStep();
      window.scrollTo(0, 0);
      return;
    }

    try {
      const fullFormData = { ...formValues, ...data };
      const res = await sendOrder(fullFormData);

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      await resetFormStores();

      router.push('/sikeres-rendeles');
    } catch (error) {
      alert(`Hiba történt a rendelés leadásakor. \n(${error})`);
    }
  };

  const resetFormStores = (): Promise<void> => {
    return new Promise((resolve) => {
      resetCart();
      resetForm();
      reset();
      resolve();
    });
  };

  if (!hasHydrated) {
    return;
  }

  if (cart.length < 1) {
    redirect('/kosar');
  }

  return (
    <div className={`container py-8 ${!isLast && 'max-w-screen-xl'}`}>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(async (data) => await onSubmit(data))}
          className="space-y-4 [&>h2]:py-2"
        >
          <div className="mx-auto max-w-screen-md">
            <StepProgress />
          </div>
          {Children.toArray(children)[step]}
        </form>
      </FormProvider>
    </div>
  );
};

export default CheckoutFormStepper;
