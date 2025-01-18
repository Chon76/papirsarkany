import AddToCartButton from '~/components/add-to-cart-button';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllKites, getKiteBySlug } from '~/lib/cms';
import { MISSING_IMG_URL, NO_NAME } from '~/lib/constants';
import { currencyFormatter } from '~/lib/formatters';

type Params = {
  slug: string;
};

export async function generateStaticParams(): Promise<Partial<Params>[]> {
  const kites = await getAllKites();

  return kites.map((kite) => ({
    slug: kite.slug?.current,
  }));
}

export default async function Kite(props: { params: Promise<Params> }) {
  const params = await props.params;
  const kite = await getKiteBySlug(params.slug);

  if (!kite) {
    notFound();
  }

  return (
    <div className="h-full space-y-8 p-8 md:flex md:gap-4 md:space-y-0">
      <div className="md:flex-[3]">
        {kite.image && (
          <Image
            className="mx-auto rounded-lg object-cover md:h-full md:w-fit"
            src={kite.image.asset?.url || MISSING_IMG_URL}
            width={kite.image.asset?.metadata?.dimensions?.width}
            height={kite.image.asset?.metadata?.dimensions?.height}
            alt={kite.name || NO_NAME}
            placeholder="blur"
            blurDataURL={kite.image.asset?.metadata?.blurHash}
          />
        )}
      </div>
      <div className="space-y-4 md:flex-[2] md:space-y-8">
        <div className="text-center md:text-left">
          <h1 className="font-bold">{kite.name}</h1>
          {kite.isBeginner && (
            <h3 className="font-bold text-primary underline underline-offset-8">
              Kezdőknek ajánlott!
            </h3>
          )}
        </div>
        <div className="space-y-2 text-center md:text-left">
          {kite.price && (
            <h2 className="font-bold text-primary">
              {currencyFormatter(kite.price)}
            </h2>
          )}
          <AddToCartButton product={kite} />
        </div>
        <div className="space-y-1">
          {kite.size && (
            <h3>
              <b>Méret: </b>
              {kite.size}
            </h3>
          )}
          {kite.materials && kite.materials?.length > 0 && (
            <h3>
              <b>Anyagok: </b>
              {kite.materials.join(', ')}
            </h3>
          )}
          {kite.windSpeed && (
            <h3>
              <b>Szél: </b>
              {kite.windSpeed}
            </h3>
          )}
          <h4>{kite.description}</h4>
        </div>
      </div>
    </div>
  );
}
