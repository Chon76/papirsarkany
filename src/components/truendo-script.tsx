/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from 'next/script';

import { isProdEnv } from '~/lib/helpers';

/**
 * IMPORTANT: Import me only in the root layout.
 *
 * Truendo is a Consent Management Platform.
 * A provider to meet the GDPR requirements, it injects a cookie banner.
 * @returns Truendo banner integration script if NODE_ENV and VERCEL_ENV is production
 */
const TruendoScript = () => {
  if (!isProdEnv()) {
    return;
  }

  return (
    <Script
      id="truendoAutoBlock"
      strategy="beforeInteractive"
      type="text/javascript"
      src="https://cdn.priv.center/pc/truendo_cmp.pid.js"
      data-siteid="88306c5c-ce8c-45d7-8daf-47e99864c1b8"
    />
  );
};

export default TruendoScript;
