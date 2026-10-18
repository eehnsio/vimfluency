/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Statisk sida utan backend: inget får laddas eller anropas utanför den egna origin.
// `style-src 'unsafe-inline'` behövs eftersom CodeMirror lägger in <style> vid körning.
// Bara i bygget: Vites dev-server använder inline-skript och websocket för HMR.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

const csp: Plugin = {
  name: 'vimfluency:csp',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
      injectTo: 'head-prepend',
    },
  ],
}

// GitHub Pages serverar sidan under /vimfluency/. Sätts bara av deploy-workflowet,
// så dev, preview och andra värdar (t.ex. Vercel) använder roten.
const base = process.env.PAGES_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), csp],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
