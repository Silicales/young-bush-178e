// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://silicales.com",
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  redirects: {
    '/blog/markdown-style-guide': '/blog',
    '/blog/first-post': '/blog',
    '/blog/second-post': '/blog',
    '/blog/third-post': '/blog',
    '/blog/using-mdx': '/blog',
    '/blog/ai-cho-tre-em-huong-dan-an-toan-2024': '/blog/huong-dan-ai-an-toan-cho-tre-em-2025',
  },
  trailingSlash: 'ignore',
});
