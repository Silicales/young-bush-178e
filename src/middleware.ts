import { defineMiddleware } from 'astro:middleware';

// Legacy redirect mappings for removed blog posts
// Both with and without trailing slash variants handled
const LEGACY_REDIRECTS: Record<string, string> = {
  '/blog/markdown-style-guide': '/blog/',
  '/blog/markdown-style-guide/': '/blog/',
  '/blog/first-post': '/blog/',
  '/blog/first-post/': '/blog/',
  '/blog/second-post': '/blog/',
  '/blog/second-post/': '/blog/',
  '/blog/third-post': '/blog/',
  '/blog/third-post/': '/blog/',
  '/blog/using-mdx': '/blog/',
  '/blog/using-mdx/': '/blog/',
  '/blog/ai-cho-tre-em-huong-dan-an-toan-2024': '/blog/huong-dan-ai-an-toan-cho-tre-em-2025/',
  '/blog/ai-cho-tre-em-huong-dan-an-toan-2024/': '/blog/huong-dan-ai-an-toan-cho-tre-em-2025/',
};

export const onRequest = defineMiddleware((context, next) => {
  const pathname = context.url.pathname;
  
  // Check if this is a legacy path that needs redirect
  if (pathname in LEGACY_REDIRECTS) {
    return context.redirect(LEGACY_REDIRECTS[pathname], 301);
  }
  
  return next();
});
