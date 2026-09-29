// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Pages stay static; only /api/waitlist runs as a Vercel function (it holds the Buttondown API key).
export default defineConfig({
  adapter: vercel(),
});
