'use client';

import Image from 'next/image';
import { FC, Fragment } from 'react';

import TrashCanIcon from '~/assets/trash-can.svg';
import useCart from '~/hooks/use-cart';
import { MISSING_IMG_URL, NO_NAME } from '~/lib/constants';
import { currencyFormatter, formatShippingFee } from '~/lib/formatters';
import { CartItem } from '~/lib/validation-schemas';
import { useCartStore } from '~/store/use-cart-store';
import Card from './card';
import ProductinCartCounter from './product-in-cart-counter';

type OrderSummaryCardProps = {
  layout?: 'full' | 'definitive';
};

const OrderSummaryCard: FC<OrderSummaryCardProps> = ({ layout = 'full' }) => {
  const cart = useCartStore((state) => state.cart);
  const shippingFee = useCartStore((state) => state.shippingFee);
  const billingFee = useCartStore((state) => state.billingFee);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const { getTotalItemCount, getTotalPrice } = useCart();

  const totalPrice = getTotalPrice();

  const onDeleteClick = (cartItem: CartItem) => {
    removeFromCart(cartItem);
  };

  if (cart.length < 1) {
    return (
      <div className="text-center">
        <h1>Üres a kosarad.</h1>
      </div>
    );
  }

  if (layout === 'definitive') {
    return (
      <Card className="flex flex-1 flex-col gap-4 p-8">
        {cart.map((item) => (
          <Fragment key={item._id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-shrink gap-2">
                <div className="hidden flex-shrink-0 min-[390px]:block">
                  {item.image && (
                    <Image
                      src={item.image.asset?.url || MISSING_IMG_URL}
                      alt={item.name || NO_NAME}
                      width={128}
                      height={128}
                      placeholder="blur"
                      blurDataURL={item.image.asset?.metadata?.blurHash}
                      className="h-auto max-h-32 min-h-24 w-32 rounded-lg object-contain"
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-bold">{item.name}</h3>

                  <span className="text-sm font-normal text-gray-400">
                    {item.quantity} db
                  </span>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end gap-4">
                {item.price && (
                  <h3 className="font-bold">
                    {currencyFormatter(item.price * item.quantity)}
                  </h3>
                )}
              </div>
            </div>
            <div className="d-divider"></div>
          </Fragment>
        ))}

        {(Boolean(shippingFee) || Boolean(billingFee)) && (
          <div>
            {Boolean(shippingFee) && (
              <div className="flex justify-between font-bold">
                <h5>Szállítás</h5>
                <h5>{formatShippingFee(shippingFee)}</h5>
              </div>
            )}
            {Boolean(billingFee) && (
              <div className="flex justify-between font-bold">
                <h5>Kezelési díj</h5>
                <h5>+{currencyFormatter(billingFee)}</h5>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between font-bold">
          <h3 className="text-balance">
            Összesen{' '}
            <span className="text-base font-normal text-gray-400">
              {getTotalItemCount()} db
            </span>
          </h3>
          <h3>{currencyFormatter(totalPrice)}</h3>
        </div>
      </Card>
    );
  }

  // TODO simplify layout
  return (
    <Card className="flex flex-1 flex-col gap-4 p-8">
      {cart.map((item) => (
        <Fragment key={item._id}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {item.image && (
                <Image
                  src={item.image.asset?.url || MISSING_IMG_URL}
                  alt={item.name || NO_NAME}
                  width={128}
                  height={128}
                  placeholder="blur"
                  blurDataURL={item.image.asset?.metadata?.blurHash}
                  className="h-auto max-h-32 min-h-24 w-32 rounded-lg object-contain"
                />
              )}

              <div>
                <h3 className="font-bold">{item.name}</h3>
                {item.price && (
                  <h4 className="block font-bold md:hidden">
                    {currencyFormatter(item.price * item.quantity)}
                  </h4>
                )}
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
              {item.price && (
                <h4 className="font-bold">
                  {currencyFormatter(item.price * item.quantity)}
                </h4>
              )}

              <div>
                <ProductinCartCounter value={item.quantity} cartItem={item} />
              </div>

              <button
                className="d-btn d-btn-square d-btn-error"
                onClick={() => onDeleteClick(item)}
              >
                <TrashCanIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div
            data-testid="cart-item-controls"
            className="flex justify-between gap-4 md:hidden"
          >
            <ProductinCartCounter value={item.quantity} cartItem={item} />

            <button
              className="d-btn d-btn-square d-btn-error"
              onClick={() => onDeleteClick(item)}
            >
              <TrashCanIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="d-divider"></div>
        </Fragment>
      ))}

      <div className="flex justify-between font-bold">
        <h3>
          Összesen{' '}
          <span className="text-base font-normal text-gray-400">
            {getTotalItemCount()} db
          </span>
        </h3>
        <h3>{currencyFormatter(totalPrice)}</h3>
      </div>
    </Card>
  );
};

export default OrderSummaryCard;
