// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

import tailwind from '@astrojs/tailwind';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://sbc.hoshinoaya.workers.dev',
  output: 'server',
  prefetch: true,

  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    imageService: 'cloudflare'
  }),

  integrations: [sitemap({
    i18n: {
      defaultLocale: 'en', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
      locales: {
        en: 'en-US', // The `defaultLocale` value must present in `locales` keys
        es: 'es-ES',
        zh: 'zh-CN',
      },
    },
  }), tailwind(), vue({ devtools: true })],
});