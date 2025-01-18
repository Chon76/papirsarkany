/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...index]]/page.tsx` route
 */
import { huHULocale } from '@sanity/locale-hu-hu';
import { visionTool } from '@sanity/vision';
import { defineConfig, isDev } from 'sanity';
// LATER add to plugins if sanity-plugin-media supports React 19
// import { media } from 'sanity-plugin-media';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './sanity/env';
import { schema } from './sanity/schema';

const devOnlyPlugins = [
  visionTool({
    defaultApiVersion: apiVersion,
    title: 'Query Playground',
  }),
];

export default defineConfig({
  title: dataset,
  basePath: '/admin',
  projectId,
  dataset,
  scheduledPublishing: {
    enabled: false
  },
  schema,
  plugins: [
    structureTool({
      title: 'Struktúra',
    }),
    huHULocale(),
    ...(isDev ? devOnlyPlugins : []),
  ],
});
