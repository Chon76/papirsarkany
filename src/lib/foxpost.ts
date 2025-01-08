import {
  FOXPOST_PACKAGE_CONSTRAINST,
  FOXPOST_PACKAGE_MAX_LIMIT,
} from './constants';
import { env } from './env';

import {
  FoxpostCreateParcelRequestBody,
  FoxpostPackageSize,
  PackageInfo,
} from './types';
import { CartItem } from './validation-schemas';

export function createParcel(body: FoxpostCreateParcelRequestBody) {
  const {
    FOXPOST_API_USERNAME,
    FOXPOST_API_PASSWORD,
    FOXPOST_API_KEY,
    FOXPOST_API_URL,
  } = env;

  const foxpostHeaders = new Headers({
    Authorization:
      'Basic ' + btoa(FOXPOST_API_USERNAME + ':' + FOXPOST_API_PASSWORD),
    'Content-Type': 'application/json',
    'Api-key': FOXPOST_API_KEY,
  });

  return fetch(`${FOXPOST_API_URL}/parcel?isWeb=true`, {
    method: 'POST',
    headers: foxpostHeaders,
    body: JSON.stringify([body]),
  });
}

export function isFitInMaxLimit(packageInfo: PackageInfo): boolean {
  const { x: cx, y: cy, z: cz } = FOXPOST_PACKAGE_MAX_LIMIT;
  return (
    packageInfo.weight <= 25 * 1000 &&
    packageInfo.x <= cx &&
    packageInfo.y <= cy &&
    packageInfo.z <= cz
  );
}

export function getFoxpostPackageSize(
  packageInfo: PackageInfo,
): FoxpostPackageSize | false {
  if (!isFitInMaxLimit(packageInfo)) {
    return false;
  }

  return (
    FOXPOST_PACKAGE_CONSTRAINST.find((constraint) => {
      const { x: cx, y: cy, z: cz } = constraint;
      return (
        packageInfo.weight <= constraint.weight &&
        packageInfo.x <= cx &&
        packageInfo.y <= cy &&
        packageInfo.z <= cz
      );
    })?.category || 'M'
  );
}

export function getTotalPackageInfo(cart: CartItem[]): PackageInfo {
  return cart.reduce(
    (total, current) => {
      return {
        x: total.x + current.packageInfo.x * current.quantity,
        y: total.y + current.packageInfo.y * current.quantity,
        z: total.z + current.packageInfo.z * current.quantity,
        weight: total.weight + current.packageInfo.weight * current.quantity,
      };
    },
    { x: 0, y: 0, z: 0, weight: 0 },
  );
}
