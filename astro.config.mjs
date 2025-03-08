// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import remarkGfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
  site: "https://nitiinkk.netlify.app/",
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkGfm],
  },
});
