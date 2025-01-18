import { PublishAction, createClient } from '@sanity/client';
import { defineQuery } from 'groq';

import { env } from '~/lib/env';
import { apiVersion, dataset, projectId, useCdn } from '@sanity/env';

const { SANITY_API_TOKEN } = env;

const client = createClient({
  projectId,
  dataset,
  useCdn,
  token: SANITY_API_TOKEN,
  apiVersion,
});

// REFACTOR make sure to trigger a single webhook
// USE CAREFULLY !!! EACH PUBLISH TRIGGERS THE REBUILD WEBHOOK
async function main() {
  const modifiedPublishedQuery = defineQuery(
    `*[count(*[_id in [^._id, "drafts." + ^._id]]) > 1]`,
  );

  const modifiedPublishedDocuments = await client.fetch(modifiedPublishedQuery);

  if (modifiedPublishedDocuments.length === 0) {
    console.log(`No modified documents found in ${dataset}.`);
    return;
  }

  const publishActions: PublishAction[] = modifiedPublishedDocuments.map(
    (document) => ({
      actionType: 'sanity.action.document.publish',
      draftId: 'drafts.' + document._id,
      publishedId: document._id,
    }),
  );

  await client.action(publishActions);

  console.table(publishActions);
  console.log(`Published ${publishActions.length} documents in ${dataset}`);
}

main().catch((e) => {
  console.error('Error publishing documents:', e);
  process.exit(1);
});
