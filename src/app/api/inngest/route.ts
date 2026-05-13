import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { functions } from '@/lib/inngest/functions';

/**
 * Inngest serve endpoint.
 *
 * Inngest's hosted infrastructure makes POST requests here to invoke
 * registered functions. The Inngest × Vercel integration registers this
 * route's URL automatically on every deploy.
 *
 * Signature verification is handled by `serve()` using INNGEST_SIGNING_KEY.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
