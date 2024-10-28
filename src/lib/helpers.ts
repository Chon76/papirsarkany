import { env } from './env';
import { OrderForm } from './validation-schemas';

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function isProdEnv(): boolean {
  return (
    process.env.NODE_ENV === 'production' && env.VERCEL_ENV === 'production'
  );
}

/**
 * Returns true if the vercel environment is a "stage" environment and PR is open for it.
 */
export function isStageEnv(): boolean {
  return (
    process.env.NODE_ENV === 'production' &&
    env.VERCEL_ENV === 'stage' &&
    Boolean(env.VERCEL_GIT_PULL_REQUEST_ID)
  );
}

export function normalizeOrderForm(data: OrderForm) {
  const { shippingOption, ...restData } = data;

  if (shippingOption === 'Személyes átvétel') {
    return {
      ...restData,
      shippingOption,
      shippingPostcode: undefined,
      shippingCity: undefined,
      shippingAddress: undefined,
      shippingSubaddress: undefined,
    };
  }

  return data;
}
